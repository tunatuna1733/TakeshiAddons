import settings from "../../settings";
import { getCurrentClass, inM7, inWitherKing } from "../../utils/dungeon";
import { registerWhen } from "../../utils/register";
import renderBeaconBeam from "../../../BeaconBeam";
import { CHAT_PREFIX } from "../../data/chat";
const Color = Java.type('java.awt.Color');

let isRelicPicked = false;
let isInWitherKing = false;

const relicCoords = {
    'Tank': { x: 19, y: 0, z: 94 },
    'Mage': { x: 92, y: 0, z: 94 },
    'Berserk': { x: 93, y: 0, z: 56 },
    'Archer': { x: 19, y: 0, z: 59 },
    'Healer': { x: 56, y: 0, z: 133 }
}

// TODO
const relicPlaceCoords = {
    'Tank': { x: 49, y: 0, z: 43 },
    'Mage': { x: 59, y: 0, z: 43 },
    'Berserk': { x: 57, y: 0, z: 41 },
    'Archer': { x: 51, y: 0, z: 41 },
    'Healer': { x: 54, y: 0, z: 40 }
}

const relicColor = {
    'Tank': Color.GREEN,
    'Mage': Color.CYAN,
    'Berserk': Color.RED,
    'Archer': Color.ORANGE,
    'Healer': Color.MAGENTA
}

registerWhen(register('step', () => {
    isInWitherKing = inWitherKing();
}).setDelay(1), () => settings.relicwaypoint);

registerWhen(register('renderWorld', () => {
    const currentClass = getCurrentClass();
    if (currentClass === '') return;
    if (inM7() && !isRelicPicked && isInWitherKing) {
        renderBeaconBeam(
            relicCoords[currentClass].x,
            relicCoords[currentClass].y,
            relicCoords[currentClass].z,
            relicColor[currentClass].getRed() / 255,
            relicColor[currentClass].getGreen() / 255,
            relicColor[currentClass].getBlue() / 255,
            0.5,
            false
        );
    }
    else if (inM7() && isRelicPicked && isInWitherKing) {
        renderBeaconBeam(
            relicPlaceCoords[currentClass].x,
            relicPlaceCoords[currentClass].y,
            relicPlaceCoords[currentClass].z,
            relicColor[currentClass].getRed() / 255,
            relicColor[currentClass].getGreen() / 255,
            relicColor[currentClass].getBlue() / 255,
            0.5,
            false
        );
    }
}), () => settings.relicwaypoint);

registerWhen(register('chat', (player, color) => {
    if (player === Player.getName()) {
        isRelicPicked = true;
    }
}).setChatCriteria('${player} picked the Corrupted ${color} Relic!'), () => settings.relicwaypoint);

registerWhen(register('worldUnload', () => {
    isRelicPicked = false;
    isInWitherKing = false;
}), () => settings.relicwaypoint);

register('command', () => {
    ChatLib.chat(`${CHAT_PREFIX} isInWitherKing: ${isInWitherKing}, isRelicPicked: ${isRelicPicked}`);
}).setCommandName('getrelicstate', true);