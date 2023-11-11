import settings from "../../settings";
import { data } from "../../utils/data";
import getItemId from "../../utils/item_id";
import { registerWhen } from "../../utils/register";

const lbRenderText = new Text('&6LastBreath: 0').setScale(1.7).setShadow(true);

let lbIncludedInHotbar = false;
let lbIncludedInInventory = false;

let lbShooting = false;
let isDuplex = false;
let lbShotCount = 0;
let lbHitCount = 0;
let lbShotUnix = [];

let lbRecordStart = 0;
let isRecording = false;

const getLastBreathHUDRenderCoords = () => {
    const x = data.lastbreath.x;
    const y = data.lastbreath.y;
    return [x, y];
}

const setLastBreathHUDRenderCoords = (x, y) => {
    data.lastbreath.x = x;
    data.lastbreath.y = y;
    data.save();
    return;
}

export const lb_hud_move_gui = new Gui();
const gui_string = 'Drag to move LastBreath HUD';
const gui_text_component = new Text(gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

lb_hud_move_gui.registerDraw(() => {
    gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!lb_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getLastBreathHUDRenderCoords();
    setLastBreathHUDRenderCoords(current_x + dx, current_y + dy);
});

registerWhen(register('step', () => {
    lbIncludedInHotbar = false;
    lbIncludedInInventory = false;
    if (Player.getInventory() !== null) {
        for (let i = 0; i < 9; i++) {
            const hotbarItem = Player.getInventory().getStackInSlot(i);
            if (hotbarItem) {
                try {
                    const itemID = hotbarItem.getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
                    if (itemID == 'LAST_BREATH' || itemID == 'STARRED_LAST_BREATH') lbIncludedInHotbar = true;
                } catch (e) {
                    // maybe not skyblock item ?
                }
            }
        }
        try {
            Player.getInventory().getItems().forEach((item) => {
                if (item) {
                    try {
                        const itemID = getItemId(item);
                        if (itemID == 'LAST_BREATH' || itemID == 'STARRED_LAST_BREATH') lbIncludedInInventory = true;
                    } catch (e) {
                        // maybe not skyblock item ?
                    }
                }
            });
        } catch (e) { }
    }
}).setDelay(1), () => settings.lbhud);

registerWhen(register(Java.type('net.minecraftforge.event.entity.player.ArrowNockEvent'), (e) => {
    if (Player.getHeldItem()) {
        const heldItemID = Player.getHeldItem().getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
        if (heldItemID === 'LAST_BREATH' || heldItemID === 'STARRED_LAST_BREATH') {
            isDuplex = false;
            Player.getHeldItem().getLore().forEach((lore) => {
                if (lore.includes('Duplex')) isDuplex = true;
            });
        }
    }
}), () => settings.lbhud);

registerWhen(register(Java.type('net.minecraftforge.event.entity.player.ArrowLooseEvent'), (e) => {
    if (Player.getHeldItem()) {
        const heldItemID = Player.getHeldItem().getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
        if (heldItemID === 'LAST_BREATH' || heldItemID === 'STARRED_LAST_BREATH') {
            lbShooting = true;
        }
    }
}), () => settings.lbhud);

registerWhen(register('soundPlay', (position, name) => {
    if (name === 'random.bow') {
        const current = Date.now();
        if (lbShooting) {
            if (!isDuplex) {
                lbShotCount++;
                lbShooting = false;
                lbShotUnix.push(current);
            } else {
                lbShotCount += 2;
                lbShooting = false;
                lbShotUnix.push(current);
                lbShotUnix.push(current);
            }
        }
    }
    if (name === 'random.successful_hit') {
        if (lbShotCount > 0) {
            lbShotCount--;
            lbHitCount++;
            lbShotUnix.splice(0, 1);
            if (!isRecording) {
                isRecording = true;
                lbRecordStart = Date.now();
            }
        }
    }
}), () => settings.lbhud);

registerWhen(register('renderOverlay', () => {
    const current = Date.now();
    lbShotUnix = lbShotUnix.filter(l => current - l < 4 * 1000);
    lbShotCount = lbShotUnix.length;
    if (current - lbRecordStart > settings.lbreset * 1000) {
        lbRecordStart = 0;
        isRecording = false;
        lbHitCount = 0;
    }
    const [lb_render_x, lb_render_y] = getLastBreathHUDRenderCoords();
    if (lbIncludedInInventory) {
        if (settings.lbhotbar) {
            if (lbIncludedInHotbar || lb_hud_move_gui.isOpen()) {
                lbRenderText.setString(`&6LastBreath: ${lbHitCount}`).setX(lb_render_x).setY(lb_render_y).draw();
            }
        } else {
            lbRenderText.setString(`&6LastBreath: ${lbHitCount}`).setX(lb_render_x).setY(lb_render_y).draw();
        }
    }
}), () => settings.lbhud);

register('worldUnload', () => {
    lbShooting = false;
    isDuplex = false;
    lbShotCount = 0;
    lbHitCount = 0;
    lbShotUnix = [];
});