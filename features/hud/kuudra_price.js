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

const kuudraProfitHud = new Hud('kuudraprofit', 'Kuudra Profit Display', hud_manager, data);
let profitText = 'Loading...';

registerWhen(register('guiOpened', () => {
    Client.scheduleTask(1, () => {
        const inventory = Player.getContainer();
        if (inventory.getName() !== 'Paid Chest') return;
        const rewardItem = inventory.getStackInSlot(11);
        if (!rewardItem) return;
        const rewardItemId = getItemId(rewardItem);
        if (rewardItemId === 'UNKNOWN_ITEM') return;
        const rewardItemName = rewardItem.getName();
        const armorType = getArmorType(rewardItemId);
        const attributes = rewardItem.getNBT()?.get('tag')?.get('ExtraAttributes')?.get('attributes')?.toObject();
        if (!attributes) return;
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
            if (response.success === false) return;
            profitText = `${rewardItemName}\n`
                + ` ${armorType} with ${attributeName1} ${attributeLevel1}\n`
                + `  ${formatNumToCoin(response.first.type.price)} coins\n`
                + ` ${armorType} with ${attributeName2} ${attributeLevel2}\n`
                + `  ${formatNumToCoin(response.second.type.price)} coins\n\n`
                + ` ${rewardItemName} with ${attributeName1} 1 & ${attributeName2} 1\n`
                + `  ${formatNumToCoin(response.both.price)} coins`;
        });
    })
}), () => settings.kuudraprofit);

registerWhen(register('postGuiRender', () => {
    if (Player.getContainer() !== null && Player.getContainer().getName() === 'Paid Chest') {
        kuudraProfitHud.draw(profitText);
    }
}), () => settings.kuudraprofit);

registerWhen(register('worldUnload', () => {
    profitText = 'Loading...';
}), () => settings.kuudraprofit);