import { CHAT_PREFIX } from '../data/chat';
import { isInSkyblock } from './hypixel';
import { setRegisters } from './register';

let currentArea = '';
let retryCount = 0;

const updateCurrentArea = () => {
  try {
    const areaLine = TabList?.getNames()?.find(
      (name) => name.includes('Area') || name.includes('Dungeon: ')
    );
    if (areaLine) {
      if (areaLine.includes('Dungeon: ') || areaLine.includes('Kuudra')) {
        setTimeout(() => {
          const zoneLine = Scoreboard.getLines().find(
            (line) =>
              line.getName().includes('⏣') || line.getName().includes('ф')
          );
          if (zoneLine) {
            const zone = zoneLine
              .getName()
              .replace('⏣ ', '')
              .replace('ф ', '')
              .removeFormatting()
              .replace(/[^\x00-\x7F]/g, '')
              .replace(/^\s+/, '');
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
      } else if (areaLine.includes('Area')) {
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
        if (isInSkyblock())
          ChatLib.chat(
            `${CHAT_PREFIX} &c[ERROR] Failed to get current area :(`
          );
      }
    }
  } catch (e) {
    console.log(`[Takeshi] Error in area.js`);
    console.log(e);
  }
};

export const getCurrentArea = () => {
  return currentArea;
};
export const getCurrentZone = () => {
  if (
    Scoreboard.getLines().find(
      (l) => l.getName().includes('⏣') || l.getName().includes('ф')
    )
  )
    return Scoreboard.getLines()
      .find((l) => l.getName().includes('⏣') || l.getName().includes('ф'))
      .getName()
      .replace('⏣ ', '')
      .replace('ф ', '')
      .removeFormatting()
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/^\s+/, '');
  else return '';
};

register('worldLoad', () => {
  updateCurrentArea();
});

register('worldUnload', () => {
  retryCount = 0;
});
