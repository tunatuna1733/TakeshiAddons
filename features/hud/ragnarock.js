import settings from '../../settings';
import { data } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from '../../utils/item_id';
import { registerWhen } from '../../utils/register';

const ragHud = new Hud('ragnarock', '&6Ragnarock: &aREADY', hud_manager, data);

const moduleName = 'Ragnarock HUD';

let lastUsed = 0;
let isUsed = false;
let ragaxeIncluded = false;
let isActive = false;

registerWhen(
  register('actionBar', (msg) => {
    const text = ChatLib.getChatMessage(msg);
    if (text.removeFormatting().includes('CASTING IN 3s') && isUsed === false) {
      lastUsed = Date.now();
      isUsed = true;
    } else if (
      !text.removeFormatting().includes('CASTING IN 2s') &&
      !text.removeFormatting().includes('CASTING IN 1s') &&
      text.removeFormatting().includes('CASTING')
    ) {
      isActive = true;
    }
  }),
  () => settings.raghud,
  { type: 'actionBar', name: moduleName }
);

registerWhen(
  register('renderOverlay', () => {
    let cd = ((20 * 1000 - (Date.now() - lastUsed)) / 1000).toFixed(1);
    if (cd < 0) cd = 0;
    if (ragaxeIncluded) {
      if (lastUsed === 0 || cd <= 0) {
        ragHud.draw(`&6Ragnarock: &aREADY`);
        isUsed = false;
      } else if (cd < 17 && cd > 7 && isActive) {
        ragHud.draw(`&6Ragnarock: &c${cd}s &aACTIVE`);
      } else {
        ragHud.draw(`&6Ragnarock: &c${cd}s`);
        isActive = false;
      }
    }
  }),
  () => settings.raghud,
  { type: 'renderOverlay', name: moduleName }
);

registerWhen(
  register('step', () => {
    ragaxeIncluded = false;
    if (Player.getInventory() !== null) {
      for (let i = 0; i < 9; i++) {
        const hotbarItem = Player.getInventory().getStackInSlot(i);
        if (hotbarItem) {
          try {
            const itemID = getItemId(hotbarItem);
            if (itemID == 'RAGNAROCK_AXE') ragaxeIncluded = true;
          } catch (e) {
            // maybe not skyblock item ?
          }
        }
      }
    }
  }).setDelay(1),
  () => settings.raghud,
  { type: 'step', name: moduleName }
);

register('worldUnload', () => {
  lastUsed = 0;
  isUsed = false;
  ragaxeIncluded = false;
  isActive = false;
});
