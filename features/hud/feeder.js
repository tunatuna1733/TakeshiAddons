import numeral from 'numeraljs';

import settings from '../../settings';
import { data } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import { registerWhen } from '../../utils/register';

const feederHud = new Hud('feeder', '&aFeeder: &60s', hud_manager, data);

registerWhen(
  register('guiMouseClick', () => {
    const inventory = Player.getContainer();
    if (inventory && inventory.getName() === 'Confirm Caducous Feeder') {
      const itemSlot = Client.currentGui.getSlotUnderMouse();
      if (itemSlot) {
        const item = itemSlot.getItem();
        if (item) {
          if (item.getName().removeFormatting() === 'Use Caducous Feeder') {
            let carrotCount = 0;
            inventory.getItems().forEach((i) => {
              if (
                i &&
                i.getName().removeFormatting() === 'Ultimate Carrot Candy'
              ) {
                carrotCount++;
              }
            });
            if (carrotCount === 1) {
              if (data['feeder']['times'][0] > data['feeder']['times'][1]) {
                data['feeder']['times'][1] = Date.now();
              } else {
                data['feeder']['times'][0] = Date.now();
              }
              data.save();
            } else if (carrotCount >= 2) {
              data['feeder']['times'] = [Date.now(), Date.now()];
              data.save();
            }
          }
        }
      }
    }
  }),
  () => settings.feedertimer,
  { type: 'guiMouseClick', name: 'Feeder Timer' }
);

registerWhen(
  register('renderOverlay', () => {
    if (!data['feeder']['times']) {
      data['feeder']['times'] = [0, 0];
      data.save();
    }
    const latest = Math.min(
      data['feeder']['times'][0],
      data['feeder']['times'][1]
    );
    const diff = Date.now() - latest;
    if (diff > 60 * 60 * 20 * 1000) {
      feederHud.draw('&aFeeder: &6Ready');
    } else {
      const remainingTime = (60 * 60 * 20 * 1000 - diff) / 1000;
      feederHud.draw(
        `&aFeeder: &6${numeral(remainingTime).format('00:00:00')}`
      );
    }
  }),
  () => settings.feedertimer,
  { type: 'renderOverlay', name: 'Feeder Timer' }
);
