import { request } from 'axios';
import settings from '../../settings';
import getArmorType from '../../utils/armor_type';
import { SkyblockAttributes } from "../../utils/attributes";
import { data } from '../../utils/data';
import formatNumToCoin from '../../utils/format_coin';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from "../../utils/item_id";
import { registerWhen } from "../../utils/register";

const display = new Display();
display.setRenderLoc(data.kuudraprofit.x, data.kuudraprofit.y);
display.setRegisterType('post gui render');
display.setBackground(DisplayHandler.Background.FULL);

let guiOpen = false;

const kuudraProfitHud = new Hud('kuudraprofit', 'Kuudra Profit Display', hud_manager, data);    // for editing location

registerWhen(register('postGuiRender', () => {
    const inventory = Player.getContainer();
    if (!guiOpen && inventory && inventory.getName() === 'Paid Chest') {
        guiOpen = true;
        const guiLoaded = register('tick', () => {
            if (inventory.getStackInSlot(inventory.getSize() - 37) == null) return;
            guiLoaded.unregister();
            display.clearLines();
            const rewardItem = inventory.getStackInSlot(11);
            if (!rewardItem) {
                ChatLib.chat('Could not find the primary reward item');
                return;
            }
            const rewardItemId = getItemId(rewardItem);
            if (rewardItemId === 'UNKNOWN_ITEM') return;
            const rewardItemName = rewardItem.getName();
            const armorType = getArmorType(rewardItemId);
            const attributes = rewardItem.getNBT()?.get('tag')?.get('ExtraAttributes')?.get('attributes')?.toObject();
            if (!attributes) {
                ChatLib.chat('Looks like the primary item does not have attributes');
                return;
            }
            display.addLine('Loading...');
            const [attributeId1, attributeId2] = Object.keys(attributes);
            const [attributeLevel1, attributeLevel2] = [attributes[attributeId1], attributes[attributeId2]];
            let attributeName1 = '', attributeName2 = '';
            SkyblockAttributes.forEach((a) => {
                if (a.id === attributeId1) attributeName1 = a.name;
                if (a.id === attributeId2) attributeName2 = a.name;
            });
            let url = `https://skyblock-hono-production.up.railway.app/lb?itemId=${rewardItemId}&attributeId1=${attributeId1}&attributeLevel1=${attributeLevel1}`;
            if (attributeId2)
                url += `&attributeId2=${attributeId2}&attributeLevel2=${attributeLevel2}`;
            request({
                url: url
            }).then(res => {
                const response = res.data;
                if (response.success === false) {
                    ChatLib.chat('Could not fetch lowest bin data.');
                    ChatLib.chat(`URL: ${url}`);
                    return;
                }
                display.addLines([
                    `${rewardItemName}\n`,
                    ` ${armorType} with ${attributeName1} ${attributeLevel1}\n`,
                    `  ${formatNumToCoin(response.first.type.price)} coins\n`,
                    ` ${armorType} with ${attributeName2} ${attributeLevel2}\n`,
                    `  ${formatNumToCoin(response.second.type.price)} coins\n\n`,
                    ` ${rewardItemName} with ${attributeName1} 1 & ${attributeName2} 1\n`,
                    `  ${formatNumToCoin(response.both.price)} coins`
                ]);
            }).catch((e) => {
                ChatLib.chat('Could not fetch lowest bin data.');
                ChatLib.chat(`URL: ${url}`);
                return;
            })
        })
    }
}), () => settings.kuudraprofit);

registerWhen(register('guiClosed', () => {
    guiOpen = false;
    display.clearLines();
}), () => settings.kuudraprofit);

registerWhen(register('worldUnload', () => {
    display.clearLines();
}), () => settings.kuudraprofit);