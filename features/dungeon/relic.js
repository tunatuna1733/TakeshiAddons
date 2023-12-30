import settings from "../../settings";
import { getCurrentClass, isInM7 } from "../../utils/dungeon";
import { registerWhen } from "../../utils/register";
import renderBeaconBeam from "../../../BeaconBeam";
const Color = Java.type('java.awt.Color');

let isRelicPhase = false;
let isRelicPicked = false;

const relicCoords = {
    'Tank': { x: 27, y: 0, z: 94 },
    'Mage': { x: 84, y: 0, z: 94 },
    'Berserk': { x: 27, y: 0, z: 59 },
    'Archer': { x: 85, y: 0, z: 56 },
    'Healer': { x: 56, y: 0, z: 125 }
}

// TODO
const relicPlaceCoords = {
    'Tank': { x: 27, y: 0, z: 94 },
    'Mage': { x: 84, y: 0, z: 94 },
    'Berserk': { x: 27, y: 0, z: 59 },
    'Archer': { x: 85, y: 0, z: 56 },
    'Healer': { x: 56, y: 0, z: 125 }
}

const relicColor = {
    'Tank': Color.GREEN,
    'Mage': Color.CYAN,
    'Berserk': Color.RED,
    'Archer': Color.ORANGE,
    'Healer': Color.MAGENTA
}

registerWhen(register('renderWorld', () => {
    if (isInM7() && isRelicPhase && !isRelicPicked) {
        const currentClass = getCurrentClass();
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
    else if (isInM7() && isRelicPhase && isRelicPicked) {
        const currentClass = getCurrentClass();
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

registerWhen(register('chat', () => {
    isRelicPhase = true;
}).setChatCriteria('[BOSS] Necron: All this, for nothing...'), () => settings.relicwaypoint);

registerWhen(register('chat', () => {
    isRelicPhase = false;
}).setChatCriteria('You... again?').setContains(), () => settings.relicwaypoint);

registerWhen(register('chat', (player, color) => {
    if (player === Player.getName()) {
        isRelicPicked = true;
    }
}).setChatCriteria('${player} picked the Corrupted ${color} Relic!'), () => settings.relicwaypoint);