import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

const ragHud = new Hud('ragnarock', '&6Ragnarock: &aREADY', hud_manager, data);

let lastUsed = 0;
let isUsed = false;
let ragaxeIncluded = false;

registerWhen(register('actionBar', (msg) => {
    const text = ChatLib.getChatMessage(msg);
    if (text.removeFormatting().includes('CASTING IN 3s') && isUsed === false) {
        lastUsed = Date.now();
        isUsed = true;
    }
}), () => settings.raghud);

registerWhen(register('renderOverlay', () => {
    const cd = ((20 * 1000 - (Date.now() - lastUsed)) / 1000).toFixed(1);
    if (settings.raghotbar === true) {
        if (ragaxeIncluded) {
            if (lastUsed === 0 || cd < 0) {
                ragHud.draw(`&6Ragnarock: &aREADY`);
                isUsed = false;
            } else {
                ragHud.draw(`&6Ragnarock: &c${cd}s`);
            }
        }
    }
    else {
        if (lastUsed === 0 || cd < 0) {
            ragHud.draw(`&6Ragnarock: &aREADY`);
            isUsed = false;
        } else {
            ragHud.draw(`&6Ragnarock: &c${cd}s`);
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