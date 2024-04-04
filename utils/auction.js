import { request } from "../../axios";
import { SkyblockAttributes } from "../data/attributes";
import { KuudraItems } from "../data/kuudra_items";

const decoder = Java.type('java.util.Base64').getDecoder();
const ByteArrayInputStream = Java.type('java.io.ByteArrayInputStream');
const Compressor = Java.type('net.minecraft.nbt.CompressedStreamTools');

let itemRetry = 0;
let allItems = [];
let tempAuctions = [];
let auctions = [];
let auctionUpdateTime = 0;

register('gameLoad', () => {
    updateItems();
});

register('step', () => {
    if (allItems.length !== 0) {
        ChatLib.chat('Updating auctions...');
        updateAuction(0);
    } else {
        ChatLib.chat('No item list. Updating...');
        updateItems();
    }
}).setDelay(5 * 60);

register('command', () => {
    if (allItems.length !== 0 && Date.now() - auctionUpdateTime > 2 * 60 * 1000) {
        ChatLib.chat('Updating auctions...');
        updateAuction(0);
    } else {
        ChatLib.chat('No item list. Updating...');
        updateItems();
    }
}).setCommandName('debugrefreshauctions');

register('command', () => {
    ChatLib.chat(auctions.length);
    ChatLib.chat(JSON.stringify(auctions[100]));
}).setCommandName('debugauctions');

const updateItems = () => {
    ChatLib.chat('Fetching item data...');
    request({
        url: 'https://api.hypixel.net/v2/resources/skyblock/items',
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)",
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (res.data.success === false) {
            itemRetry++;
            ChatLib.chat('Failed to fetch item data.');
            setTimeout(() => {
                ChatLib.chat(`Retrying... ${itemRetry}`);
                updateItems();
            }, itemRetry * 1000);
        } else {
            allItems = res.data.items;
        }
    })
}

// Credit: Volcaddons
const decode = (itemByte) => {
    const byteArray = decoder.decode(itemByte);
    const inputStream = new ByteArrayInputStream(byteArray);
    const nbt = Compressor.func_74796_a(inputStream);
    return nbt.func_150295_c('i', 10);
}

// Credit: Volcaddons
const formatAuction = (rawAuction) => {
    const nbtData = new NBTTagCompound(decode(rawAuction.item_bytes).func_150305_b(0)).getCompoundTag('tag');
    const extraAttributes = nbtData.getCompoundTag('ExtraAttributes');
    const itemId = extraAttributes.getString('id');
    const itemNameWithFormat = nbtData.getCompoundTag('display').getString('Name');
    const itemData = allItems.find(i => i.id === itemId);
    const attributes = extraAttributes.getCompoundTag('attributes').toObject();
    const attributeNames = Object.keys(attributes);
    const formattedAttributes = [];
    attributeNames.forEach((a) => {
        const attribute = SkyblockAttributes.find(s => s.id === a);
        formattedAttributes.push({
            name: attribute.name,
            id: attribute.id,
            value: attributes[a]
        });
    });
    const auctionData = {
        uuid: rawAuction.uuid,
        auctioneer: rawAuction.auctioneer,
        profileId: rawAuction.profileId,
        start: rawAuction.start,
        end: rawAuction.end,
        itemName: rawAuction.item_name,
        itemNameWithFormat,
        itemId,
        tier: rawAuction.tier,
        price: rawAuction.starting_bid,
        itemData,
        attributes: formattedAttributes,
        claimed: rawAuction.claimed,
        bin: rawAuction.bin
    }
    return auctionData;
}

const updateAuction = (page) => {
    if (page === 0) {
        tempAuctions = [];
    }
    request({
        url: `https://api.hypixel.net/v2/skyblock/auctions?page=${page}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)",
            "Content-Type": "application/json"
        }
    }).then((res) => {
        const response = res.data;
        if (response.success === true) {
            const pages = response.totalPages;
            response.auctions.forEach((auction) => {
                if (auction.claimed === false && 'bin' in auction && auction.bin === true)
                    tempAuctions.push(formatAuction(auction));
            });
            if (page + 1 < pages) updateAuction(page + 1);
            else {
                auctions = tempAuctions.sort((a, b) => {
                    if (a.price < b.price) return -1;
                    else if (a.price > b.price) return 1;
                    return 0;
                });
                auctionUpdateTime = Date.now();
                ChatLib.chat('Auctions updated.');
            }
        }
    });
}

const checkAttribute = (auction, attributeSearch) => {
    let hasAttribute = false;
    if (auction.attributes) {
        auction.attributes.forEach((auctionAttribute) => {
            if (auctionAttribute.id === attributeSearch.id &&
                auctionAttribute.value >= attributeSearch.value &&
                !hasAttribute
            )
                hasAttribute = true;
        });
    }
    return hasAttribute;
};

export const getAllAuctions = () => { return auctions };

/*
    armor
     type
      a1 with level
      a2 with level
     exact
      a1 with level
      a2 with level
      a1 and a2 without level

    equip
     exact
      a1 with level
      a2 with level
      a1 and a2 without level
*/

export const getPriceData = (itemId, isArmor, attributeSearchQuery) => {
    if (isArmor) {
        let typeResults = {}, exactMatchResults = {};
        let armorType = '';
        if (itemId.includes('HELMET')) armorType = 'HELMET';
        else if (itemId.includes('CHESTPLATE')) armorType = 'CHESTPLATE';
        else if (itemId.includes('LEGGINGS')) armorType = 'LEGGINGS';
        else if (itemId.includes('BOOTS')) armorType = 'BOOTS';
        attributeSearchQuery.forEach((as) => {
            typeResults[as.id] = auctions.filter(a => {
                return (
                    KuudraItems[armorType].includes(a.itemId) &&
                    checkAttribute(a, as)
                );
            });
            exactMatchResults[as.id] = auctions.filter(a => {
                return (
                    a.itemId === itemId &&
                    checkAttribute(a, as)
                );
            });
        });
        if (attributeSearchQuery.length === 2) {
            exactMatchResults['both'] = auctions.filter(a => {
                return (
                    a.itemId === itemId &&
                    checkAttribute(a, { id: attributeSearchQuery[0].id, value: 1 }) &&
                    checkAttribute(a, { id: attributeSearchQuery[1].id, value: 1 })
                );
            });
        }
        return [typeResults, exactMatchResults];
    } else {
        let exactMatchResults = {};
        attributeSearchQuery.forEach((as) => {
            exactMatchResults[as.id] = auctions.filter(a => {
                return (
                    a.itemId === itemId &&
                    checkAttribute(a, as)
                );
            });
        });
        if (attributeSearchQuery.length === 2) {
            exactMatchResults['both'] = auctions.filter(a => {
                return (
                    a.itemId === itemId &&
                    checkAttribute(a, { id: attributeSearchQuery[0].id, value: 1 }) &&
                    checkAttribute(a, { id: attributeSearchQuery[1].id, value: 1 })
                );
            });
        }
        return exactMatchResults;
    }
}

register('command', (itemId, attributeId1, attributeLevel1, attributeId2, attributeLevel2) => {
    ChatLib.chat(`${itemId}, ${attributeId1}, ${attributeLevel1}, ${attributeId2}, ${attributeLevel2}`);
    let isArmor = false;
    if (itemId.toLowerCase().includes('helmet') ||
        itemId.toLowerCase().includes('chestplate') ||
        itemId.toLowerCase().includes('leggings') ||
        itemId.toLowerCase().includes('boots')
    ) isArmor = true;
    let attributeSearchQuery = [];
    if (attributeId1) {
        attributeSearchQuery.push({
            id: attributeId1,
            value: attributeLevel1 ? attributeLevel1 : 1
        });
        if (attributeId2) {
            attributeSearchQuery.push({
                id: attributeId2,
                value: attributeLevel2 ? attributeLevel2 : 1
            });
        }
    }
    const results = getPriceData(itemId, isArmor, attributeSearchQuery);
    if (isArmor) {
        ChatLib.chat('Type match');
        ChatLib.chat(` ${JSON.stringify(results[0][attributeId1][0])}`);

        ChatLib.chat('Exact match');
        ChatLib.chat(` ${JSON.stringify(results[1][attributeId1][0])}`);
    } else {
        ChatLib.chat('A1');
        ChatLib.chat(` ${JSON.stringify(results[attributeId1][0])}`);

        if (attributeId2) {
            ChatLib.chat('A2');
            ChatLib.chat(` ${JSON.stringify(results[attributeId2][0])}`);

            ChatLib.chat('Both');
            ChatLib.chat(` ${JSON.stringify(results['both'][0])}`);
        }
    }
}).setCommandName('debugatsearch');