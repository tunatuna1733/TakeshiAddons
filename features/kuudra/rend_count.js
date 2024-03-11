import { CHAT_PREFIX } from "../../data/chat";
import settings from "../../settings";
import { registerWhen } from "../../utils/register";

let rends = 0;

// Credit: NwjnAddons
registerWhen(register('soundPlay', () => {
    rends++;
    if (rends > 1) return;
    Client.scheduleTask(20, () => {
        if (rends !== 1) {
            ChatLib.chat(`${CHAT_PREFIX} &bRend Arrows: &a${rends - 1}`);
        }
        rends = 0;
    });
}).setCriteria('game.neutral.hurt'), () => settings.rendcount, { type: 'soundPlay', name: 'Rend Count' });