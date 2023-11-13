import settings from "../../settings";
import getCurrentArmor from "../../utils/current_armor";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
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
const dominusHud = new Hud('crimson', '&6Dominus: 0ᝐ', hud_manager, data);
const hydraHud = new Hud('terror', '&6Hydra Strike: 0⁑', hud_manager, data);

const getArmorStack = (armors) => {
    let crimsonTier = 0;
    let terrorTier = 0;
    armors.forEach((armor) => {
        if (armor) {
            try {
                const lores = armor.getLore();
                lores.forEach((lore) => {
                    if (lore.removeFormatting().includes('Tiered Bonus: Dominus')) {
                        crimsonTier = parseInt(lore.match(stackRegex)[0][0]);
                    } else if (lore.removeFormatting().includes('Tiered Bonus: Hydra Strike')) {
                        terrorTier = parseInt(lore.match(stackRegex)[0][0]);
                    }
                });
            } catch (e) {
                // sometimes crash cuz lores are not immediately loaded when player moves to another dimension
            }
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
    let crimsonSecLeft = ((crimsonExpireSec * 1000 - (Date.now() - lastCrimsonHit)) / 1000.0).toFixed(1);
    if (crimsonSecLeft < 0) crimsonSecLeft = 0;
    if (crimsonStack > 0 && crimsonSecLeft >= 0) {
        dominusHud.draw(`&6Dominus: ${dominusText} &6${crimsonSecLeft}s`);
        if (crimsonSecLeft < 3) {
            dominusHud.draw(`&6Dominus: ${dominusText} &c${crimsonSecLeft}s`);
        }
    } else if (crimsonExpireSec > 0) {
        dominusHud.draw(`&6Dominus: 0ᝐ`);
    }
}), () => (settings.crimsonhud));

registerWhen(register('renderOverlay', () => {
    let terrorSecLeft = ((terrorExpireSec * 1000 - (Date.now() - lastTerrorHit)) / 1000.0).toFixed(1);
    if (terrorSecLeft < 0) terrorSecLeft = 0;
    if (terrorStack > 0 && terrorSecLeft >= 0) {
        hydraHud.draw(`&6Hydra Strike: ${hydraText} &6${terrorSecLeft}s`);
        if (terrorSecLeft < 3) {
            hydraHud.draw(`&6Hydra Strike: ${hydraText} &c${terrorSecLeft}s`);
        }
    } else if (terrorExpireSec > 0) {
        hydraHud.draw(`&6Hydra Strike: 0⁑`);
    }
}), () => (settings.terrorhud));

register('worldUnload', () => {
    crimsonStack = 0;
    terrorStack = 0;
    crimsonExpireSec = 0;
    terrorExpireSec = 0;
    lastCrimsonHit = 0;
    lastTerrorHit = 0;
    dominusText = '';
    hydraText = '';
})