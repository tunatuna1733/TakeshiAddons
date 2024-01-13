import { CHAT_PREFIX } from "../data/chat";
import { setRegisters } from "./register";

let currentArea = '';
let retryCount = 0;

const updateCurrentArea = () => {
    const areaLine = TabList?.getNames()?.find((name) => name.includes('Area') || name.includes('Dungeon: '));
    if (areaLine) {
        if (areaLine.includes('Dungeon: ') || areaLine.includes('Kuudra')) {
            setTimeout(() => {
                const zoneLine = Scoreboard.getLines().find((line) => line.getName().includes("⏣") || line.getName().includes("ф"));
                if (zoneLine) {
                    const zone = zoneLine.getName().replace("⏣ ", "").replace("ф ", "").removeFormatting().replace(/[^\x00-\x7F]/g, "").replace(/^\s+/, '');
                    if (currentArea !== zone) {
                        currentArea = zone;
                        setTimeout(() => {
                            setRegisters();
                        }, 1000);
                    }
                } else {
                    retryCount++;
                    setTimeout(() => {
                        updateCurrentArea();
                    }, 1000);
                }
            }, 1000);
        }
        else if (areaLine.includes('Area')) {
            const area = areaLine.replace('Area: ', '').removeFormatting();
            if (currentArea !== area) {
                currentArea = area;
                setTimeout(() => {
                    setRegisters();
                }, 1000);
            }
        }
    } else {
        if (retryCount < 20) {
            retryCount++;
            setTimeout(() => {
                updateCurrentArea();
            }, 1000);
        } else {
            ChatLib.chat(`${CHAT_PREFIX} &c[ERROR] Failed to get current area :(`);
        }
    }
}

export const getCurrentArea = () => { return currentArea };

register('worldLoad', () => {
    updateCurrentArea();
});

register('worldUnload', () => {
    retryCount = 0;
});

register('command', () => {
    ChatLib.chat(getCurrentArea());
}).setCommandName('debugcurrentarea');