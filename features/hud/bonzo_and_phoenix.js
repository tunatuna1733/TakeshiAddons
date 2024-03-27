import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

const phoenixHud = new Hud('phoenix', '&6Phoenix: &a0s', hud_manager, data);
const bonzoHud = new Hud('bonzo', '&6Bonzo: &a0s', hud_manager, data);

let phoenixProcTime = 0;
let bonzoProcTime = 0;
let isPhoenix = false;
let isBonzo = false;

registerWhen(register('chat', () => {
    phoenixProcTime = Date.now();
    isPhoenix = true;
}).setChatCriteria('Your Phoenix Pet saved you from certain death!'), () => settings.bonzophoenixtimer, { type: 'chat', name: 'Phoenix Timer' });

registerWhen(register('chat', () => {
    bonzoProcTime = Date.now();
    isBonzo = true;
}).setChatCriteria("Your ⚚ Bonzo's Mask saved your life!"), () => settings.bonzophoenixtimer, { type: 'chat', name: 'Bonzo Timer' });

registerWhen(register('chat', () => {
    bonzoProcTime = Date.now();
    isBonzo = true;
}).setChatCriteria("Your Bonzo's Mask saved your life!"), () => settings.bonzophoenixtimer, { type: 'chat', name: 'Bonzo Timer' });

registerWhen(register('renderOverlay', () => {
    if (isPhoenix) {
        const currentTime = Date.now() - phoenixProcTime;
        phoenixHud.draw(`&6Phoenix: &a${(4 - currentTime / 1000).toFixed(1)}`);
        if (currentTime > 4 * 1000) {
            isPhoenix = false;
        }
    }
    if (isBonzo) {
        const currentTime = Date.now() - bonzoProcTime;
        bonzoHud.draw(`&6Bonzo: &a${(3 - currentTime / 1000).toFixed(1)}`);
        if (currentTime > 3 * 1000) {
            isBonzo = false;
        }
    }
}), () => settings.bonzophoenixtimer, { type: 'renderOverlay', name: 'Bonzo and Phoenix Timer' });