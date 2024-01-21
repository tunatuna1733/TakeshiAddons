import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { isInSkyblock } from "../../utils/hypixel";
import { registerWhen } from "../../utils/register";

const kickHud = new Hud('kicktimer', '&6Kicked for &c0s', hud_manager, data);
const moduleName = 'Kick Timer';

let kickTime = 0;
let joinedOnce = false;

registerWhen((register('step', () => {
    if (isInSkyblock()) {
        joinedOnce = true;
        kickTime = 0;
    } else if (Server.getIP().includes('hypixel') && ChatLib.removeFormatting(Scoreboard.getTitle()).includes('PROTOTYPE')) {
        kickTime++;
    }
}).setDelay(1)), () => settings.kicktimer, { type: 'step', name: moduleName });

registerWhen((register('renderOverlay', () => {
    if (kickTime > 0 && joinedOnce === true) kickHud.draw(`&6Kicked for &c${kickTime}s`, false);
})), () => settings.kicktimer, { type: 'renderOverlay', name: moduleName });

register('worldLoad', () => {
    kickTime = 0;
});

register('serverDisconnect', () => {
    joinedOnce = false;
});