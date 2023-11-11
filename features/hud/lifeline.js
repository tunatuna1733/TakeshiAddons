import settings from "../../settings";
import { data } from "../../utils/data";
import { registerWhen } from "../../utils/register";

let isInKuudraP5 = false;
const hpRegex = /[1-9][0-9]*\/[1-9][0-9]*❤/gm;
let currentHP = 0;
let maxHP = 0;
const lifelineRenderText = new Text(`&6Lifeline: &cNOT ACTIVE`).setScale(1.5).setShadow(true);

const getLifelineHUDRenderCoords = () => {
    const x = data.lifeline.x;
    const y = data.lifeline.y;
    return [x, y];
}

const setLifelineHUDRenderCoords = (x, y) => {
    data.lifeline.x = x;
    data.lifeline.y = y;
    data.save();
    return;
}

export const ll_hud_move_gui = new Gui();
const gui_string = 'Drag to move Lifeline HUD';
const gui_text_component = new Text(gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

ll_hud_move_gui.registerDraw(() => {
    gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!ll_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getLifelineHUDRenderCoords();
    setLifelineHUDRenderCoords(current_x + dx, current_y + dy);
});

registerWhen(register('chat', () => {
    isInKuudraP5 = true;
}).setChatCriteria("[NPC] Elle: POW! SURELY THAT'S IT! I don't think he has any more in him!"), () => settings.lifelinehud);

registerWhen(register('actionBar', (msg) => {
    const text = ChatLib.getChatMessage(msg);
    const healthResult = text.match(hpRegex);
    if (healthResult) {
        [currentHP, maxHP] = healthResult[0].replace('❤', '').split('/');
    }
}), () => settings.lifelinehud);

registerWhen(register('renderOverlay', () => {
    const [ll_render_x, ll_render_y] = getLifelineHUDRenderCoords();
    if (data.equipment.id1 == 'LAVA_SHELL_NECKLACE') {
        if (settings.lifelinekuudra) {
            if (isInKuudraP5 || ll_hud_move_gui.isOpen()) {
                if (currentHP / maxHP < 0.2) {
                    lifelineRenderText.setString(`&6Lifeline: &aACTIVE`).setX(ll_render_x).setY(ll_render_y).draw();
                } else {
                    lifelineRenderText.setString(`&6Lifeline: &cNOT ACTIVE`).setX(ll_render_x).setY(ll_render_y).draw();
                }
            }
        } else {
            if (currentHP / maxHP < 0.2) {
                lifelineRenderText.setString(`&6Lifeline: &aACTIVE`).setX(ll_render_x).setY(ll_render_y).draw();
            } else {
                lifelineRenderText.setString(`&6Lifeline: &cNOT ACTIVE`).setX(ll_render_x).setY(ll_render_y).draw();
            }
        }
    }
}), () => settings.lifelinehud);

register('worldUnload', () => {
    isInKuudraP5 = false;
})