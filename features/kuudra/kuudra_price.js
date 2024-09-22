import settings from '../../settings';
import getArmorType from '../../utils/armor_type';
import { SkyblockAttributes } from '../../data/attributes';
import { data } from '../../utils/data';
import formatNumToCoin from '../../utils/format_coin';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from '../../utils/item_id';
import { registerWhen } from '../../utils/register';
import { getPriceData } from '../../utils/auction';

const display = new Display();
display.setRenderLoc(data.kuudraprofit.x, data.kuudraprofit.y);
display.setRegisterType('post gui render');
display.setBackground(DisplayHandler.Background.FULL);

let guiOpen = false;

const kuudraProfitHud = new Hud(
  'kuudraprofit',
  'Kuudra Profit Display',
  hud_manager,
  data
); // for editing location

const moduleName = 'Kuudra Profit';

registerWhen(
  register('postGuiRender', () => {
    const inventory = Player.getContainer();
    if (!guiOpen && inventory && inventory.getName() === 'Paid Chest') {
      guiOpen = true;
      const guiLoaded = register('tick', () => {
        if (inventory.getStackInSlot(inventory.getSize() - 37) == null) return;
        guiLoaded.unregister();
        const [x, y] = kuudraProfitHud.getCoords();
        display.clearLines();
        display.setRenderX(x);
        display.setRenderY(y);
        const rewardItem = inventory.getStackInSlot(11);
        if (!rewardItem) {
          ChatLib.chat('Could not find the primary reward item');
          return;
        }
        const rewardItemId = getItemId(rewardItem);
        if (rewardItemId === 'UNKNOWN_ITEM') return;
        if (rewardItemId === 'HOLLOW_WAND') return;
        const rewardItemName = rewardItem.getName();
        const armorType = getArmorType(rewardItemId);
        const attributes = rewardItem
          .getNBT()
          ?.get('tag')
          ?.get('ExtraAttributes')
          ?.get('attributes')
          ?.toObject();
        if (!attributes) {
          if (settings.debugmode) {
            ChatLib.chat(
              'Looks like the primary item does not have attributes'
            );
            return;
          }
        }
        display.addLine('Loading...');
        const [attributeId1, attributeId2] = Object.keys(attributes);
        const [attributeLevel1, attributeLevel2] = [
          attributes[attributeId1],
          attributes[attributeId2],
        ];
        let attributeName1 = '',
          attributeName2 = '';
        SkyblockAttributes.forEach((a) => {
          if (a.id === attributeId1) attributeName1 = a.name;
          if (a.id === attributeId2) attributeName2 = a.name;
        });
        let attributeSearchQuery = [
          {
            id: attributeId1,
            value: attributeLevel1,
          },
        ];
        if (attributeId2) {
          attributeSearchQuery.push({
            id: attributeId2,
            value: attributeLevel2,
          });
        }
        let url = `https://skyblock.tunatuna.dev/lb?itemId=${rewardItemId}&attributeId1=${attributeId1}&attributeLevel1=${attributeLevel1}`;
        if (attributeId2)
          url += `&attributeId2=${attributeId2}&attributeLevel2=${attributeLevel2}`;
        request({
          url: url
        }).then(res => {
          const response = res.data;
          if (response.success === false) {
            ChatLib.chat('Could not fetch lowest bin data.');
            return;
          }
          let price1 = 'Unknown';
          let price2 = 'Unknown';
          let priceBoth = 'Unknown';
          if (response.data.first.type) {
            price1 = response.data.first.type.price ? formatNumToCoin(response.data.first.type.price) : 'Unknown';
          }
          if (response.data.second.type) {
            price2 = response.data.second.type.price ? formatNumToCoin(response.data.second.type.price) : 'Unknown';
          }
          if (response.data.both) {
            priceBoth = response.data.both.price ? formatNumToCoin(response.data.both.price) : 'Unknown';
          }
          display.clearLines();
          display.addLines([
            `${rewardItemName}\n`,
            ` ${armorType} with ${attributeName1} ${attributeLevel1}\n`,
            `  ${price1} coins\n`,
            ` ${armorType} with ${attributeName2} ${attributeLevel2}\n`,
            `  ${price2} coins\n\n`,
            ` ${rewardItemName} with ${attributeName1} 1 & ${attributeName2} 1\n`,
            `  ${priceBoth} coins`
          ]);
        }).catch((e) => {
          ChatLib.chat('Could not fetch lowest bin data.');
          ChatLib.chat(e);
          return;
        });

        /*
        const results = getPriceData(
          rewardItemId,
          armorType !== 'Unknown',
          attributeSearchQuery
        );
        display.clearLines();
        if (armorType !== 'Unknown') {
          const typePrice1 =
            results[0][attributeId1][0] && results[0][attributeId1][0]['price']
              ? formatNumToCoin(results[0][attributeId1][0]['price'])
              : 'Unknown';
          const typePrice2 =
            results[0][attributeId2][0] && results[0][attributeId2][0]['price']
              ? formatNumToCoin(results[0][attributeId2][0]['price'])
              : 'Unknown';
          const exactPrice1 =
            results[1][attributeId1][0] && results[1][attributeId1][0]['price']
              ? formatNumToCoin(results[1][attributeId1][0]['price'])
              : 'Unknown';
          const exactPrice2 =
            results[1][attributeId2][0] && results[1][attributeId2][0]['price']
              ? formatNumToCoin(results[1][attributeId2][0]['price'])
              : 'Unknown';
          const exactBothPrice =
            results[1]['both'][0] && results[1]['both'][0]['price']
              ? formatNumToCoin(results[1]['both'][0]['price'])
              : 'Unknown';
          display.addLines([
            `${rewardItemName}\n`,
            ` ${armorType} with ${attributeName1} ${attributeLevel1}\n`,
            `  ${typePrice1} coins\n`,
            ` ${rewardItemName} with ${attributeName1} ${attributeLevel1}\n`,
            `  ${exactPrice1} coins\n\n`,
            ` ${armorType} with ${attributeName2} ${attributeLevel2}\n`,
            `  ${typePrice2} coins\n`,
            ` ${rewardItemName} with ${attributeName2} ${attributeLevel2}\n`,
            `  ${exactPrice2} coins\n\n`,
            ` ${rewardItemName} with ${attributeName1} 1 & ${attributeName2} 1\n`,
            `  ${exactBothPrice} coins`,
          ]);
        } else {
          const price1 = results[attributeId1][0]['price']
            ? formatNumToCoin(results[attributeId1][0]['price'])
            : 'Unknown';
          const price2 = results[attributeId2][0]['price']
            ? formatNumToCoin(results[attributeId2][0]['price'])
            : 'Unknown';
          const bothPrice = results[attributeId1][0]['price']
            ? formatNumToCoin(results[attributeId1][0]['price'])
            : 'Unknown';
          display.addLines([
            `${rewardItemName}\n`,
            ` ${rewardItemName} with ${attributeName1} ${attributeLevel1}\n`,
            `  ${price1} coins\n`,
            ` ${rewardItemName} with ${attributeName2} ${attributeLevel2 ?? '?'}\n`,
            `  ${price2} coins\n\n`,
            ` ${rewardItemName} with ${attributeName1} 1 & ${attributeName2} 1\n`,
            `  ${bothPrice} coins`,
          ]);
        }
        */
      });
    }
  }),
  () => settings.kuudraprofit,
  { type: 'postGuiRender', name: moduleName }
);

registerWhen(
  register('guiClosed', () => {
    guiOpen = false;
    display.clearLines();
  }),
  () => settings.kuudraprofit,
  { type: 'guiClosed', name: moduleName }
);

registerWhen(
  register('worldUnload', () => {
    display.clearLines();
  }),
  () => settings.kuudraprofit,
  { type: 'worldUnload', name: moduleName }
);
