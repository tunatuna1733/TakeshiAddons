import { CHAT_PREFIX } from "../../data/chat";
import settings from "../../settings";
import { data } from "../../utils/data";
import { getCurrentClass, inM7, inMaxor } from "../../utils/dungeon";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

const chestGlitchHud = new Hud('chestglitch', '&6Chest: &aOK!', hud_manager, data);

const moduleName = 'Chest Glitch';

let validCoord = false;

/**
 * Return true if the given number is valid coord for glitching through the floor.
 * @param {number} coord 
 */
const isCoordValid = (coord) => {
    const flooredFloat = coord - Math.trunc(Math.ceil(coord * Math.pow(10, 4)) / Math.pow(10, 4));
    if (flooredFloat === 0.2375 || flooredFloat === 0.7624) return true;
    else return false;
}

const isGlitching = () => {
    if (inMaxor() && Player.getY() > 220 && (
        getCurrentClass === 'Healer' || getCurrentClass === 'Mage'
    )) {
        return true;
    } else if (inMaxor() && (
        Player.getX() > 45 && Player.getX() < 65 &&
        Player.getY() > 110 && Player.getY() < 120 &&
        Player.getZ() > 50 && Player.getZ() < 120
    ) && getCurrentClass === 'Healer') {
        return true;
    } else return false;
}

registerWhen(register('renderWorld', () => {
    if (isGlitching()) {
        const [x, z] = [Player.getX(), Player.getZ()];
        if (isCoordValid(x) || isCoordValid(z)) validCoord = true;
        else validCoord = false;
    }
}), () => (settings.chestglitch && inM7()), { type: 'renderWorld', name: moduleName });

registerWhen(register('renderOverlay', () => {
    if (isGlitching()) {
        if (validCoord) chestGlitchHud.draw('&6Chest: &aOK!');
        else chestGlitchHud.draw('&6Chest: &cNO!');
    }
}), () => (settings.chestglitch && inM7()), { type: 'renderOverlay', name: moduleName });

registerWhen(register('worldUnload', () => {
    validCoord = false;
}), () => settings.chestglitch, { type: 'worldUnload', name: moduleName });

register('command', () => {
    ChatLib.chat(`${CHAT_PREFIX} &e[DEBUG] x: ${isCoordValid(Player.getX())}, z: ${isCoordValid(Player.getZ())}`);
}).setCommandName('debugchestalign');