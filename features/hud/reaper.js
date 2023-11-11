import settings from "../../settings";
import getItemId from "../../utils/item_id";
import { data } from "../../utils/data";
import { registerWhen } from "../../utils/register";

let reaperUsed = 0
let isActive = false;
let ragaxeIncluded = false;
let reaperIncluded = false;
const reaperRenderText = new Text('&6Reaper: &aREADY').setScale(1.7).setShadow(true);

const getReaperHUDRenderCoords = () => {
    const x = data.reaper.x;
    const y = data.reaper.y;
    return [x, y];
}

const setReaperHUDRenderCoords = (x, y) => {
    data.reaper.x = x;
    data.reaper.y = y;
    data.save();
    return;
}

export const reaper_hud_move_gui = new Gui();
const gui_string = 'Drag to move Reaper Armor HUD';
const gui_text_component = new Text(gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

reaper_hud_move_gui.registerDraw(() => {
    gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!reaper_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getReaperHUDRenderCoords();
    setReaperHUDRenderCoords(current_x + dx, current_y + dy);
});

const isReaperChestplate = (cp) => {
    let isReaper = false;
    cp.getLore().forEach((lore) => {
        if (lore.toString().includes('#FF0000') && getItemId(cp) == 'REAPER_CHESTPLATE') isReaper = true;
    });
    return isReaper;
}

registerWhen(register("soundPlay", () => {
    setTimeout(() => {
        const chestplate = Player.armor.getChestplate();
        if (chestplate !== null && isReaperChestplate(chestplate) && !isActive) {
            reaperUsed = Date.now();
            isActive = true;
        }
    }, 100);
}).setCriteria("mob.zombie.remedy"), () => settings.reaperhud);

registerWhen(register('step', () => {
    ragaxeIncluded = false;
    reaperIncluded = false;
    if (Player.getInventory() !== null) {
        try {
            Player.getInventory().getItems().forEach((item) => {
                if (item) {
                    try {
                        const itemID = getItemId(item);
                        if (itemID == 'RAGNAROCK_AXE') ragaxeIncluded = true;
                        if (itemID == 'REAPER_CHESTPLATE') reaperIncluded = true;
                    } catch (e) {
                        // maybe not skyblock item ?
                    }
                }
            });
        } catch (e) { }
    }
}).setDelay(1), () => settings.raghud);

registerWhen(register('renderOverlay', () => {
    const [reaper_render_x, reaper_render_y] = getReaperHUDRenderCoords();
    const cd = ((25 * 1000 - (Date.now() - reaperUsed)) / 1000).toFixed(1);
    if (cd < 25 - 6) isActive = false;
    if (settings.reaperrag === true) {
        if (ragaxeIncluded || reaper_hud_move_gui.isOpen()) {
            if (reaperUsed === 0 || cd < 0) {
                reaperRenderText.setString(`&6Reaper: &aREADY`).setX(reaper_render_x).setY(reaper_render_y).draw();
            } else if (isActive) {
                reaperRenderText.setString(`&6Reaper: &c${cd}s &aACTIVE`).setX(reaper_render_x).setY(reaper_render_y).draw();
            } else {
                reaperRenderText.setString(`&6Reaper: &c${cd}s`).setX(reaper_render_x).setY(reaper_render_y).draw();
            }
        }
    } else {
        if (reaperUsed === 0 || cd < 0) {
            reaperRenderText.setString(`&6Reaper: &aREADY`).setX(reaper_render_x).setY(reaper_render_y).draw();
        } else if (isActive) {
            reaperRenderText.setString(`&6Reaper: &c${cd}s &aACTIVE`).setX(reaper_render_x).setY(reaper_render_y).draw();
        } else {
            reaperRenderText.setString(`&6Reaper: &c${cd}s`).setX(reaper_render_x).setY(reaper_render_y).draw();
        }
    }
}), () => settings.reaperhud && reaperIncluded);

register('worldUnload', () => {
    reaperUsed = 0;
    isActive = false;
});