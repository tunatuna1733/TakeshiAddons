import settings from "../../settings";
import { data } from "../../utils/data";
import { registerWhen } from "../../utils/register";

const ragRenderText = new Text('&6Ragnarock: &aREADY').setScale(1.7).setShadow(true);

let lastUsed = 0;
let isUsed = false;
let ragaxeIncluded = false;

const getRagnarockHUDRenderCoords = () => {
    const x = data.ragnarock.x;
    const y = data.ragnarock.y;
    return [x, y];
}

const setRagnarockHUDRenderCoords = (x, y) => {
    data.ragnarock.x = x;
    data.ragnarock.y = y;
    data.save();
    return;
}

export const rag_hud_move_gui = new Gui();
const gui_string = 'Drag to move Ragnarock HUD';
const gui_text_component = new Text(gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

rag_hud_move_gui.registerDraw(() => {
    gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!rag_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getRagnarockHUDRenderCoords();
    setRagnarockHUDRenderCoords(current_x + dx, current_y + dy);
});

registerWhen(register('actionBar', (msg) => {
    const text = ChatLib.getChatMessage(msg);
    if (text.removeFormatting().includes('CASTING IN 3s') && isUsed === false) {
        lastUsed = Date.now();
        isUsed = true;
    }
}), () => settings.raghud);

registerWhen(register('renderOverlay', () => {
    const [rag_render_x, rag_render_y] = getRagnarockHUDRenderCoords();
    const cd = ((20 * 1000 - (Date.now() - lastUsed)) / 1000).toFixed(1);
    if (settings.raghotbar === true) {
        if (ragaxeIncluded || rag_hud_move_gui.isOpen()) {
            if (lastUsed === 0 || cd < 0) {
                ragRenderText.setString(`&6Ragnarock: &aREADY`).setX(rag_render_x).setY(rag_render_y).draw();
                isUsed = false;
            } else {
                ragRenderText.setString(`&6Ragnarock: &c${cd}s`).setX(rag_render_x).setY(rag_render_y).draw();
            }
        }
    }
    else {
        if (lastUsed === 0 || cd < 0) {
            ragRenderText.setString(`&6Ragnarock: &aREADY`).setX(rag_render_x).setY(rag_render_y).draw();
            isUsed = false;
        } else {
            ragRenderText.setString(`&6Ragnarock: &c${cd}s`).setX(rag_render_x).setY(rag_render_y).draw();
        }
    }
}), () => settings.raghud);

registerWhen(register('step', () => {
    ragaxeIncluded = false;
    if (Player.getInventory() !== null) {
        for (let i = 0; i < 9; i++) {
            const hotbarItem = Player.getInventory().getStackInSlot(i);
            if (hotbarItem) {
                try {
                    const itemID = hotbarItem.getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
                    if (itemID == 'RAGNAROCK_AXE') ragaxeIncluded = true;
                } catch (e) {
                    // maybe not skyblock item ?
                }
            }
        }
    }
}).setDelay(1), () => settings.raghud);

register('worldUnload', () => {
    lastUsed = 0;
    isUsed = false;
    ragaxeIncluded = false;
});