import renderBeaconBeam from "../../../BeaconBeam";
import settings from "../../settings";
import { registerWhen } from "../../utils/register";
import TerminalCoords from "../../data/terminalcoords";
const BossStatus = Java.type('net.minecraft.entity.boss.BossStatus');

let isInGoldor = false;
let isInM7 = false;
let currentClass = '';

registerWhen(register('chat', () => {
    if (isInM7) {
        currentClass = 'Mage';
    }
}).setChatCriteria("[Mage] Intelligence").setContains(), () => settings.terminalwaypoint);

registerWhen(register('chat', () => {
    if (isInM7) {
        currentClass = 'Healer';
    }
}).setChatCriteria("[Healer] Renew Healing").setContains(), () => settings.terminalwaypoint);

registerWhen(register('chat', () => {
    if (isInM7) {
        currentClass = 'Berserk';
    }
}).setChatCriteria("[Berserk] Melee Damage").setContains(), () => settings.terminalwaypoint);

registerWhen(register('chat', () => {
    if (isInM7) {
        currentClass = 'Archer';
    }
}).setChatCriteria("[Archer] Extra Arrow Chance").setContains(), () => settings.terminalwaypoint);

registerWhen(register('chat', () => {
    if (isInM7) {
        currentClass = 'Tank';
    }
}).setChatCriteria("[Tank] Defense ${b}->${a}"), () => settings.terminalwaypoint);

registerWhen(register('step', () => {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return;
    if (bossName.removeFormatting().includes('Goldor')) isInGoldor = true;
    else isInGoldor = false;

    const lines = Scoreboard.getLines();
    isInM7 = false;
    lines.forEach((line) => {
        if (line.getName().removeFormatting().includes('(M7)')) isInM7 = true;
    });
}).setDelay(1), () => settings.terminalwaypoint);

registerWhen(register('renderOverlay', () => {
    if (isInGoldor && isInM7) {
        if (currentClass == 'Tank') {
            renderBeaconBeam(TerminalCoords.First[0].x, TerminalCoords.First[0].y, TerminalCoords.First[0].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Second[0].x, TerminalCoords.Second[0].y, TerminalCoords.Second[0].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Third[0].x, TerminalCoords.Third[0].y, TerminalCoords.Third[0].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Forth[0].x, TerminalCoords.Forth[0].y, TerminalCoords.Forth[0].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
        }
        if (currentClass == 'Mage') {
            renderBeaconBeam(TerminalCoords.First[1].x, TerminalCoords.First[1].y, TerminalCoords.First[1].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Second[1].x, TerminalCoords.Second[1].y, TerminalCoords.Second[1].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Third[1].x, TerminalCoords.Third[1].y, TerminalCoords.Third[1].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Forth[1].x, TerminalCoords.Forth[1].y, TerminalCoords.Forth[1].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
        }
        if (currentClass == 'Berserk') {
            renderBeaconBeam(TerminalCoords.First[2].x, TerminalCoords.First[2].y, TerminalCoords.First[2].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Second[2].x, TerminalCoords.Second[2].y, TerminalCoords.Second[2].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Third[2].x, TerminalCoords.Third[2].y, TerminalCoords.Third[2].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Forth[2].x, TerminalCoords.Forth[2].y, TerminalCoords.Forth[2].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
        }
        if (currentClass == 'Archer') {
            renderBeaconBeam(TerminalCoords.First[3].x, TerminalCoords.First[3].y, TerminalCoords.First[3].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Second[3].x, TerminalCoords.Second[3].y, TerminalCoords.Second[3].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Third[3].x, TerminalCoords.Third[3].y, TerminalCoords.Third[3].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
            renderBeaconBeam(TerminalCoords.Forth[3].x, TerminalCoords.Forth[3].y, TerminalCoords.Forth[3].z, settings.terminalcolor.getRed() / 255, settings.terminalcolor.getGreen() / 255, settings.terminalcolor.getBlue() / 255, settings.terminalcolor.getAlpha() / 255, false);
        }
    }
}), () => settings.terminalwaypoint);

register('command', () => {
    ChatLib.chat(`m7: ${isInM7} goldor: ${isInGoldor} class: ${currentClass}`);
}).setCommandName('terminaldebug');
