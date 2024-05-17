import settings from "../../settings";
import { inM7 } from "../../utils/dungeon";
import { registerWhen } from "../../utils/register";
import { getPing } from "../hud/ping";

registerWhen(register('guiOpened', () => {
    Client.scheduleTask(5, () => {
        if (Player.getContainer()?.getName().removeFormatting() === 'Click the button on time!') {
            ChatLib.command(`pc ${settings.melodytext} Ping: ${getPing()}ms`);
        }
    });
}), () => settings.melodyannounce && inM7(), { type: 'guiOpened', name: 'Melody' });

registerWhen(register('tick', () => {
    if (Player?.getContainer()?.getName() !== 'Click the button on time!') return;
}), () => settings.melodyannounce && inM7(), { type: 'tick', name: 'Melody' })