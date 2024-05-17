import { getCurrentArea } from "./area";

const BossStatus = Java.type('net.minecraft.entity.boss.BossStatus');

let lb = 0;
let icespray = false;

export const setLb = (lbCount) => { lb = lbCount; };
export const getLb = () => { return lb; };
export const setSpray = (iceSprayHit) => { icespray = iceSprayHit; };
export const getSpray = () => { return icespray; };

export const getCurrentClass = () => {
    if (!TabList) return '';
    const tabNames = TabList.getNames();
    const partyNumLine = tabNames.find((name) => name.includes('§r§b§lParty §r§f('));
    let currentClass = '';
    try {
        if (partyNumLine) {
            const partyNum = partyNumLine.match(/\d+/g)[0];
            for (let i = 0; i < partyNum; i++) {
                if (tabNames[i * 4 + 1].removeFormatting().includes(Player.getName())) {
                    currentClass = tabNames[i * 4 + 1].removeFormatting().match(/\((\S+)\s+(\S+)\)/)[1];
                }
            }
        }
    } catch (e) {
        // maybe not loaded
    }
    return currentClass;
};

export const inF7 = () => {
    if (getCurrentArea().includes('The Catacombs (F7)')) return true;
    else return false;
};

// M7
export const inM7 = () => {
    if (getCurrentArea().includes('The Catacombs (M7)')) return true;
    else return false;
};

export const inMaxor = () => {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    if (bossName.removeFormatting().includes('Maxor')) return true;
    else return false;
};

export const inGoldor = () => {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    if (bossName.removeFormatting().includes('Goldor')) return true;
    else return false;
};

export const inNecron = () => {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    if (bossName.removeFormatting().includes('Necron')) return true;
    else return false;
};

export const inWitherKing = () => {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    if (bossName.removeFormatting().includes('Wither King')) return true;
    return false;
};

export const getBossHealthPercent = () => {
    return BossStatus.field_82828_a;
};

register('command', () => {
    ChatLib.chat(BossStatus.field_82828_a);
}).setCommandName('debugbosshealthscale', true);