import renderBeaconBeam from "../../../BeaconBeam";
import settings from "../../settings";
import { registerWhen } from "../../utils/register";
import TerminalCoords from "../../data/terminalcoords";
import { getCurrentClass, inGoldor, inM7 } from "../../utils/dungeon";

let isInGoldor = false;
let isInM7 = false;
let currentClass = '';
let beaconList = [];

const getClassNumber = (className) => {
    let classNumber = -1;
    if (className === 'Tank') {
        classNumber = 0;
    } else if (className === 'Mage') {
        classNumber = 1;
    } else if (className === 'Berserk') {
        classNumber = 2;
    } else if (className === 'Archer') {
        classNumber = 3;
    }
    return classNumber;
}

registerWhen(register('step', () => {
    isInGoldor = inGoldor();
    isInM7 = inM7();
    if (isInM7)
        currentClass = getCurrentClass();
    if (currentClass !== '' && beaconList.length === 0) {
        const classNumber = getClassNumber(currentClass);
        if (settings.firstterminal === classNumber)
            beaconList.push(TerminalCoords.First);
        if (settings.secondterminal === classNumber)
            beaconList.push(TerminalCoords.Second);
        if (settings.thirdterminal === classNumber)
            beaconList.push(TerminalCoords.Third);
        if (settings.fourthterminal === classNumber)
            beaconList.push(TerminalCoords.Fourth);
        // beaconList.flat();
    }
}).setDelay(1), () => settings.terminalwaypoint);

registerWhen(register('renderWorld', () => {
    if (isInGoldor && isInM7) {
        beaconList.forEach((beacon) => {
            renderBeaconBeam(beacon.x, beacon.y, beacon.z,
                settings.terminalcolor.getRed() / 255,
                settings.terminalcolor.getGreen() / 255,
                settings.terminalcolor.getBlue() / 255,
                settings.terminalcolor.getAlpha() / 255,
                false
            );
        });
    }
}), () => settings.terminalwaypoint);

registerWhen(register('chat', (player) => {
    if (player === Player.getName()) {
        beaconList.splice(0, 1);
    }
}).setChatCriteria('${player} completed a device! (${num}/${maxnum})'), () => settings.terminalwaypoint);

registerWhen(register('worldUnload', () => {
    beaconList = [];
}), () => settings.terminalwaypoint);

register('command', () => {
    ChatLib.chat(`m7: ${isInM7} goldor: ${isInGoldor} class: ${currentClass}`);
}).setCommandName('terminaldebug');
