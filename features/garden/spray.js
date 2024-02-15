import numeral from "numeraljs";
import settings from "../../settings";
import { data, gardenData } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";
import { getCurrentArea, getCurrentZone } from "../../utils/area";

const sprayHud = new Hud('spray', '&6Spray: &a30m', hud_manager, data);

let warned = false;
let shouldWarn = false;

registerWhen(register('renderOverlay', () => {
    const remainingTime = (30 * 60 * 1000 - (Date.now() - gardenData.sprayTime)) / 1000;
    if (remainingTime > 0) {
        const formattedTime = numeral(remainingTime).format('00:00:00').replace('0:', '');
        sprayHud.draw(`&6Spray: &a${formattedTime}`);
        shouldWarn = false;
    } else {
        sprayHud.draw('&6Spray: &cExpired');
        shouldWarn = true;
        if (!warned && getCurrentArea() === 'Garden' && (getCurrentZone().includes('Plot - ') || getCurrentZone().includes('The Garden'))) {
            warned = true;
            World.playSound('note.pling', 4, 1.5);
            Client.showTitle('&cSpray Expired!', '', 0, 3 * 20, 0);
            Client.showTitle('&cSpray Expired!', '', 0, 3 * 20, 0);
        }
    }
}), () => settings.spraytimer && getCurrentArea() === 'Garden', { type: 'renderOverlay', name: 'Spray Timer' });

registerWhen(register('step', () => {
    if (settings.sprayalwayswarn && shouldWarn) {
        Client.showTitle('&cSpray Expired!', '', 0, 1, 0);
        Client.showTitle('&cSpray Expired!', '', 0, 6 * 20, 0);
    }
}).setDelay(5), () => settings.spraytimer && getCurrentArea() === 'Garden', { type: 'step', name: 'Spray Timer' })

registerWhen(register('chat', () => {
    gardenData.sprayTime = Date.now();
    gardenData.save();
    warned = false;
}).setChatCriteria('SPRAYONATOR! This will expire in 30m!'), () => settings.spraytimer && getCurrentArea() === 'Garden', { type: 'chat', name: 'Spray Timer' });
