import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

let isInKuudraP5 = false;
// const hpRegex = /[1-9][0-9]*\/[1-9][0-9]*❤/gm;
// let currentHP = 0;
// let maxHP = 0;
const lifelineHud = new Hud('lifeline', `&6Lifeline: &cNOT ACTIVE`, hud_manager, data);

const moduleName = 'Lifeline HUD';

registerWhen(register('chat', () => {
    isInKuudraP5 = true;
}).setChatCriteria("[NPC] Elle: POW! SURELY THAT'S IT! I don't think he has any more in him!"), () => settings.lifelinehud, { type: 'chat', name: moduleName });

/*
registerWhen(register('actionBar', (msg) => {
    const text = ChatLib.getChatMessage(msg);
    const healthResult = text.match(hpRegex);
    if (healthResult) {
        [currentHP, maxHP] = healthResult[0].replace('❤', '').split('/');
    }
}), () => settings.lifelinehud, { type: 'actionBar', name: moduleName });
*/

registerWhen(register('renderOverlay', () => {
    if (data.equipment.id1 == 'LAVA_SHELL_NECKLACE') {
        const maxHp = Player.asPlayerMP().getMaxHP();
        const currentHp = Player.asPlayerMP().getHP();
        if (settings.lifelinekuudra) {
            if (isInKuudraP5) {
                if (currentHp / maxHp < 0.2) {
                    lifelineHud.draw(`&6Lifeline: &aACTIVE`);
                } else {
                    lifelineHud.draw(`&6Lifeline: &cNOT ACTIVE`);
                }
            }
        } else {
            if (currentHp / maxHp < 0.2) {
                lifelineHud.draw(`&6Lifeline: &aACTIVE`);
            } else {
                lifelineHud.draw(`&6Lifeline: &cNOT ACTIVE`);
            }
        }
    }
}), () => settings.lifelinehud, { type: 'renderOverlay', name: moduleName });

register('worldUnload', () => {
    isInKuudraP5 = false;
});