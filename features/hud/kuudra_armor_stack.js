import settings from "../../settings";
import getCurrentArmor from "../../utils/current_armor";
import { data } from "../../utils/data";
import { registerWhen } from "../../utils/register";

const crimsonActionBarRegex = /(§6(§l)?[0-9]+ᝐ)(§r)?./gm;
const terrorActionBarRegex = /(§6(§l)?[0-9]+⁑)(§r)?./gm;
const stackRegex = /[1-4]\/4/;
const stackExpireSec = [0, 5, 5, 8, 11];
let crimsonStack = 0;
let terrorStack = 0;
let crimsonExpireSec = 0;
let terrorExpireSec = 0;
let lastCrimsonHit = 0;
let lastTerrorHit = 0;
let dominusText = '';
let hydraText = '';
const dominusRenderText = new Text('&6Dominus: 0ᝐ', { scale: 1.5 }).setShadow(true);
const hydraRenderText = new Text('&6Hydra Strike: 0⁑', { scale: 1.5 }).setShadow(true);

const getCrimsonStackHUDRenderCoords = () => {
    const x = data.armorStack.crimson.x;
    const y = data.armorStack.crimson.y;
    return [x, y];
}

const setCrimsonStackHUDRenderCoords = (x, y) => {
    data.armorStack.crimson.x = x;
    data.armorStack.crimson.y = y;
    data.save();
    return;
}

const getTerrorStackHUDRenderCoords = () => {
    const x = data.armorStack.terror.x;
    const y = data.armorStack.terror.y;
    return [x, y];
}

const setTerrorStackHUDRenderCoords = (x, y) => {
    data.armorStack.terror.x = x;
    data.armorStack.terror.y = y;
    data.save();
    return;
}

export const dominus_hud_move_gui = new Gui();
const dominus_gui_string = 'Drag to move Dominus HUD';
const dominus_gui_text_component = new Text(dominus_gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(dominus_gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

dominus_hud_move_gui.registerDraw(() => {
    dominus_gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!dominus_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getCrimsonStackHUDRenderCoords();
    setCrimsonStackHUDRenderCoords(current_x + dx, current_y + dy);
});

export const hydra_hud_move_gui = new Gui();
const hydra_gui_string = 'Drag to move Hydra Strike HUD';
const hydra_gui_text_component = new Text(hydra_gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(hydra_gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

hydra_hud_move_gui.registerDraw(() => {
    hydra_gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!hydra_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getTerrorStackHUDRenderCoords();
    setTerrorStackHUDRenderCoords(current_x + dx, current_y + dy);
});

const getArmorStack = (armors) => {
    let crimsonTier = 0;
    let terrorTier = 0;
    armors.forEach((armor) => {
        if (armor) {
            const lores = armor.getLore();
            lores.forEach((lore) => {
                if (lore.removeFormatting().includes('Tiered Bonus: Dominus')) {
                    crimsonTier = parseInt(lore.match(stackRegex)[0][0]);
                } else if (lore.removeFormatting().includes('Tiered Bonus: Hydra Strike')) {
                    terrorTier = parseInt(lore.match(stackRegex)[0][0]);
                }
            });
        }
    });
    return [crimsonTier, terrorTier];
}

registerWhen(register('step', () => {
    const armors = getCurrentArmor();
    const [crimsonTier, terrorTier] = getArmorStack(armors);
    crimsonExpireSec = stackExpireSec[crimsonTier];
    terrorExpireSec = stackExpireSec[terrorTier];
}).setDelay(1), () => (settings.crimsonhud || settings.terrorhud));

registerWhen(register('actionBar', (msg) => {
    const text = ChatLib.getChatMessage(msg);
    const crimsonResult = text.match(crimsonActionBarRegex);
    const terrorResult = text.match(terrorActionBarRegex);
    if (crimsonResult) {
        dominusText = crimsonResult[0];
        const newCrimsonStack = parseInt(crimsonResult[0].removeFormatting().match(/1?[0-9]/)[0]);
        if (newCrimsonStack !== crimsonStack) {
            lastCrimsonHit = Date.now();
        }
        crimsonStack = newCrimsonStack;
    } else {
        crimsonStack = 0;
    }
    if (terrorResult) {
        hydraText = terrorResult[0];
        const newTerrorStack = parseInt(terrorResult[0].removeFormatting().match(/1?[0-9]/)[0]);
        if (newTerrorStack !== terrorStack) {
            lastTerrorHit = Date.now();
        }
        terrorStack = newTerrorStack;
    } else {
        terrorStack = 0;
    }
}), () => (settings.crimsonhud || settings.terrorhud));

registerWhen(register('soundPlay', (pos, name, vol, pitch, category, e) => {
    if (name === 'tile.piston.out' && crimsonExpireSec > 0 && crimsonStack === 10) {
        lastCrimsonHit = Date.now();
    }
    if (name === 'tile.piston.out' && terrorExpireSec > 0 && terrorStack === 10) {
        lastTerrorHit = Date.now();
    }
}), () => (settings.crimsonhud || settings.terrorhud));

registerWhen(register('renderOverlay', () => {
    const [crimson_render_x, crimson_render_y] = getCrimsonStackHUDRenderCoords();
    let crimsonSecLeft = ((crimsonExpireSec * 1000 - (Date.now() - lastCrimsonHit)) / 1000.0).toFixed(1);
    if (crimsonSecLeft < 0) crimsonSecLeft = 0;
    if (crimsonStack > 0 && crimsonSecLeft >= 0) {
        dominusRenderText.setString(`&6Dominus: ${dominusText} ${crimsonSecLeft}s`).setX(crimson_render_x).setY(crimson_render_y).draw();
    } else if (crimsonExpireSec > 0 || dominus_hud_move_gui.isOpen()) {
        dominusRenderText.setString(`&6Dominus: 0ᝐ`).setX(crimson_render_x).setY(crimson_render_y).draw();
    }
}), () => (settings.crimsonhud));

registerWhen(register('renderOverlay', () => {
    const [terror_render_x, terror_render_y] = getTerrorStackHUDRenderCoords();
    let terrorSecLeft = ((terrorExpireSec * 1000 - (Date.now() - lastTerrorHit)) / 1000.0).toFixed(1);
    if (terrorSecLeft < 0) terrorSecLeft = 0;
    if (terrorStack > 0 && terrorSecLeft >= 0) {
        hydraRenderText.setString(`&6Hydra Strike: ${hydraText} ${terrorSecLeft}s`).setX(terror_render_x).setY(terror_render_y).draw();
    } else if (terrorExpireSec > 0 || hydra_hud_move_gui.isOpen()) {
        hydraRenderText.setString(`&6Hydra Strike: 0⁑`).setX(terror_render_x).setY(terror_render_y).draw();
    }
}), () => (settings.terrorhud));

register('worldUnload', () => {
    let crimsonStack = 0;
    let terrorStack = 0;
    let crimsonExpireSec = 0;
    let terrorExpireSec = 0;
    let lastCrimsonHit = 0;
    let lastTerrorHit = 0;
    let dominusText = '';
    let hydraText = '';
})