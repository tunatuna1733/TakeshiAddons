import { CHAT_PREFIX } from "../data/chat";

const BossStatus = Java.type('net.minecraft.entity.boss.BossStatus');

export const getCurrentClass = () => {
    const tabNames = TabList.getNames();
    const partyNumLine = tabNames.find((name) => name.includes('§r§b§lParty §r§f('));
    let currentClass = 'Unknown';
    if (partyNumLine) {
        const partyNum = partyNumLine.match('/\d+/g');
        for (let i = 0; i < partyNum; i++) {
            if (partyNumLine.removeFormatting().includes(Player.getName())) {
                currentClass = tabNames[i * 4 + 1].removeFormatting().match('/\((\S+)\s+(\S+)\)/');
            }
        }
    }
    return currentClass;
}

// M7
export const isInM7 = () => {
    let inM7 = false;
    const lines = Scoreboard.getLines();
    lines.forEach((line) => {
        if (line.getName().removeFormatting().includes('M7')) inM7 = true;
    });
    return inM7;
};

export const isInGoldor = () => {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    if (bossName.removeFormatting().includes('Goldor')) return true;
    else return false;
}

export const isInWitherKing = () => {
    // TODO
    return false;
}

// debug------------------------------------
register('command', () => {
    ChatLib.chat(`${CHAT_PREFIX} Current Class: ${getCurrentClass()}`);
}).setCommandName('getcurrentclass', true);