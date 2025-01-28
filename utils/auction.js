import { request } from '../../axios';
import { Promise } from '../../PromiseV2';
import { SkyblockAttributes } from '../data/attributes';
import { CHAT_PREFIX } from '../data/chat';
import { CrimsonSetItems, KuudraItems } from '../data/kuudra_items';
import { sendDebugMessage } from './debug';

const decoder = Java.type('java.util.Base64').getDecoder();
const ByteArrayInputStream = Java.type('java.io.ByteArrayInputStream');
const Compressor = Java.type('net.minecraft.nbt.CompressedStreamTools');

const attributeItems = [];

let itemRetry = 0;
let allItems = [];
let auctions = [];
let auctionUpdateTime = 0;

let tempAuctions = [];
let auctionCount = 0;
let fetchStartTime = 0;
let currentPage = 0;

register('gameLoad', () => {
  updateItems();
  setTimeout(() => {
    allItems.forEach((i) => {
      if ('can_have_attributes' in i && i['can_have_attributes'] === true) {
        attributeItems.push(i.name);
      }
    });
    // updateAuction();
    // updateAuctionSync(0);
    updateAuctionFromApi();
  }, 5000);
});

register('gameUnload', () => {
  auctions = [];
});

register('step', () => {
  if (allItems.length !== 0) {
    // updateAuction();
    // updateAuctionSync(0);
    updateAuctionFromApi();
  } else {
    // ChatLib.chat('No item list. Updating...');
    updateItems();
  }
}).setDelay(2 * 60);

const updateItems = () => {
  ChatLib.chat('Fetching item data...');
  request({
    url: 'https://api.hypixel.net/v2/resources/skyblock/items',
    headers: {
      'User-Agent': 'Mozilla/5.0 (ChatTriggers)',
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.data.success === false) {
      itemRetry++;
      ChatLib.chat(`${CHAT_PREFIX} &cFailed to fetch item data. Retrying...`);
      setTimeout(() => {
        updateItems();
      }, itemRetry * 1000);
    } else {
      allItems = res.data.items;
      sendDebugMessage('&aFetched item data.');
    }
  });
};

// Credit: Volcaddons
const decode = (itemByte) => {
  const byteArray = decoder.decode(itemByte);
  const inputStream = new ByteArrayInputStream(byteArray);
  const nbt = Compressor.func_74796_a(inputStream);
  return nbt.func_150295_c('i', 10);
};

// Credit: Volcaddons
const formatAuction = (rawAuction) => {
  const nbtData = new NBTTagCompound(decode(rawAuction.item_bytes).func_150305_b(0)).getCompoundTag('tag');
  const extraAttributes = nbtData.getCompoundTag('ExtraAttributes');
  const itemId = extraAttributes.getString('id');
  const itemNameWithFormat = nbtData.getCompoundTag('display').getString('Name');
  const itemData = allItems.find((i) => i.id === itemId);
  const attributes = extraAttributes.getCompoundTag('attributes').toObject();
  const attributeNames = Object.keys(attributes);
  const formattedAttributes = [];
  attributeNames.forEach((a) => {
    const attribute = SkyblockAttributes.find((s) => s.id === a);
    formattedAttributes.push({
      name: attribute.name,
      id: attribute.id,
      value: attributes[a],
    });
  });
  const auctionData = {
    uuid: rawAuction.uuid,
    auctioneer: rawAuction.auctioneer,
    profileId: rawAuction.profileId,
    lastUpdated: rawAuction.lastUpdated,
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
    bin: rawAuction.bin,
  };
  return auctionData;
};

const updateAuctionFromApi = () => {
  request({
    url: 'https://skyblock.tunatuna.dev/attributeitems',
    headers: {
      'User-Agent': 'Mozilla/5.0 (ChatTriggers)',
      'Content-Type': 'application/json',
    },
  }).then((r) => {
    const response = r.data;
    if (response.success === true) {
      auctions = response.data;
    }
  });
};

const updateAuctionSync = (page) => {
  if (page === 0) {
    tempAuctions = [];
    auctionCount = 0;
    alluuids = [];
    tempuuids = [];
    sendDebugMessage('&eStarted updating auctions.');
    fetchStartTime = Date.now();
  }
  currentPage = page;
  request({
    url: `https://api.hypixel.net/v2/skyblock/auctions?page=${page}`,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Content-Type': 'application/json',
    },
    timeout: 3000,
  }).then((r) => {
    const response = r.data;
    const totalPages = response.totalPages;
    const lastUpdated = response.lastUpdated;
    let finished = false;
    // next request
    if (page + 1 < totalPages) updateAuctionSync(page + 1);
    else finished = true;
    // format
    auctionCount += response.auctions.length;
    response.auctions.forEach((auction) => {
      auction.lastUpdated = lastUpdated;
      if (
        auction.claimed === false &&
        'bin' in auction &&
        auction.bin === true &&
        checkHasAttributes(auction.item_name)
      ) {
        tempAuctions.push(formatAuction(auction));
      } else {
        tempAuctions.push(auction);
      }
    });
    if (finished) {
      sendDebugMessage(`&eFetched and processed all auctions. Elapsed Time: ${Date.now() - fetchStartTime}ms`);
      setTimeout(() => {
        sendDebugMessage('&eRegistered sort trigger.');
        const sortTrigger = register('step', () => {
          sendDebugMessage(`&e${auctionCount}, ${tempAuctions.length}, ${totalPages - 1}, ${page}`);
          if (auctionCount === tempAuctions.length && totalPages - 1 === page) {
            sortTrigger.unregister();
            sendDebugMessage('&eSorting auctions...');
            const sortStartTime = Date.now();
            tempAuctions.sort((a, b) => {
              if (a.price < b.price) return -1;
              else if (a.price > b.price) return 1;
              return 0;
            });
            auctions = tempAuctions;
            tempAuctions = [];
            sendDebugMessage(`&eAuction sorted. Elapsed Time: ${Date.now() - sortStartTime}ms`);
          }
        });
      }, 5000);
    }
  });
};

const updateAuction = () => {
  let auctionsPromise = [];
  let tempAuctions = [];
  request({
    url: 'https://api.hypixel.net/v2/skyblock/auctions',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Content-Type': 'application/json',
    },
    timeout: 3000,
  }).then((res) => {
    const totalPages = res.data.totalPages;
    const lastUpdated = res.data.lastUpdated;
    sendDebugMessage(`&eStarted updating auctions. Total Pages: ${totalPages}`);
    for (let i = 0; i < totalPages; i++) {
      auctionsPromise.push(
        new Promise((resolve) => {
          request({
            url: `https://api.hypixel.net/v2/skyblock/auctions?page=${i}`,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
              'Content-Type': 'application/json',
            },
            timeout: 3000,
          }).then((r) => {
            resolve(r.data.auctions);
          });
        }),
      );
    }
    return Promise.all(auctionsPromise)
      .then((auctionsList) => {
        sendDebugMessage(`&eFetched auctions. Pages: ${auctionsList.length}`);
        auctionsList.forEach((as) => {
          as.forEach((a) => {
            if (a.claimed === false && 'bin' in a && a.bin === true) {
              a.lastUpdated = lastUpdated;
              tempAuctions.push(a);
            }
          });
        });
      })
      .then(() => {
        new Thread(() => {
          sendDebugMessage('&eFormatting auctions...');
          const processStart = Date.now();
          let formattedAuctions = [];
          tempAuctions.forEach((a) => {
            if (checkHasAttributes(a.item_name)) {
              formattedAuctions.push(formatAuction(a));
            } else {
              formattedAuctions.push(a);
            }
          });
          sendDebugMessage(`&eFormatted all auctions. Elapsed time: ${Date.now() - processStart}ms`);
          sendDebugMessage('&eSorting auctions.');
          const sortStart = Date.now();
          auctions = formattedAuctions.sort((a, b) => {
            if (a.price < b.price) return -1;
            else if (a.price > b.price) return 1;
            return 0;
          });
          sendDebugMessage(`&eSorted auctions. Elapsed time: ${Date.now() - sortStart}ms`);
          auctionUpdateTime = Date.now();
          sendDebugMessage('&eUpdated auctions');
        }).start();
      });
  });
};

const checkHasAttributes = (itemName) => {
  let hasAttributes = false;
  attributeItems.forEach((ai) => {
    if (!hasAttributes) {
      if (itemName.toLowerCase().includes(ai.toLowerCase())) hasAttributes = true;
    }
  });
  return hasAttributes;
};

export const checkExactAttribute = (auction, attributeId, attributeLevel) => {
  let match = false;
  auction.attributes.forEach((attribute) => {
    if (attribute.id === attributeId && attribute.value === Number.parseInt(attributeLevel)) match = true;
  });
  return match;
};

const checkAttribute = (auction, attributeSearch) => {
  let hasAttribute = false;
  if (auction.attributes) {
    auction.attributes.forEach((auctionAttribute) => {
      if (
        auctionAttribute.id === attributeSearch.id &&
        auctionAttribute.value >= attributeSearch.value &&
        !hasAttribute
      )
        hasAttribute = true;
    });
  }
  return hasAttribute;
};

export const getAllItems = () => {
  return allItems;
};

export const getAllAuctions = () => {
  return auctions;
};

export const getPureItemName = (itemId) => {
  let itemName = '';
  allItems.forEach((item) => {
    if (item.id === itemId) itemName = item.name;
  });
  return itemName;
};

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
    let typeResults = {};
    let exactMatchResults = {};
    let armorType = '';
    if (itemId.includes('HELMET')) armorType = 'HELMET';
    else if (itemId.includes('CHESTPLATE')) armorType = 'CHESTPLATE';
    else if (itemId.includes('LEGGINGS')) armorType = 'LEGGINGS';
    else if (itemId.includes('BOOTS')) armorType = 'BOOTS';
    attributeSearchQuery.forEach((as) => {
      typeResults[as.id] = auctions.filter((a) => {
        return KuudraItems[armorType].includes(a.itemId) && checkAttribute(a, as);
      });
      exactMatchResults[as.id] = auctions.filter((a) => {
        return a.itemId === itemId && checkAttribute(a, as);
      });
    });
    if (attributeSearchQuery.length === 2) {
      exactMatchResults['both'] = auctions.filter((a) => {
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
      exactMatchResults[as.id] = auctions.filter((a) => {
        return a.itemId === itemId && checkAttribute(a, as);
      });
    });
    if (attributeSearchQuery.length === 2) {
      exactMatchResults['both'] = auctions.filter((a) => {
        return (
          a.itemId === itemId &&
          checkAttribute(a, { id: attributeSearchQuery[0].id, value: 1 }) &&
          checkAttribute(a, { id: attributeSearchQuery[1].id, value: 1 })
        );
      });
    }
    return exactMatchResults;
  }
};

export const getSingleAttributeAuctions = (attributeId) => {
  // armor
  const armorKeys = ['HELMET', 'CHESTPLATE', 'LEGGINGS', 'BOOTS'];
  const armorAuctions = {
    HELMET: [],
    CHESTPLATE: [],
    LEGGINGS: [],
    BOOTS: [],
  };
  armorKeys.forEach((armor) => {
    armorAuctions[armor] = auctions.filter((a) => {
      return KuudraItems[armor].includes(a.itemId) && checkAttribute(a, { id: attributeId, value: 1 });
    });
  });

  // molten set
  const equipmentKeys = ['NECKLACE', 'CLOAK', 'BELT', 'BRACELET'];
  const moltenAuctions = {
    NECKLACE: [],
    CLOAK: [],
    BELT: [],
    BRACELET: [],
  };
  equipmentKeys.forEach((piece) => {
    moltenAuctions[piece] = auctions.filter((a) => {
      return KuudraItems[piece].includes(a.itemId) && checkAttribute(a, { id: attributeId, value: 1 });
    });
  });

  // crimson / vanquished set
  const vanqAuctions = {
    NECKLACE: [],
    CLOAK: [],
    BELT: [],
    BRACELET: [],
  };
  equipmentKeys.forEach((piece) => {
    vanqAuctions[piece] = auctions.filter((a) => {
      return CrimsonSetItems[piece].includes(a.itemId) && checkAttribute(a, { id: attributeId, value: 1 });
    });
  });

  // magmalord armor
  const magmalordAuctions = {
    HELMET: [],
    CHESTPLATE: [],
    LEGGINGS: [],
    BOOTS: [],
  };
  armorKeys.forEach((piece) => {
    magmalordAuctions[piece] = auctions.filter((a) => {
      return a.itemId === `MAGMALORD_${piece}` && checkAttribute(a, { id: attributeId, value: 1 });
    });
  });

  // rods
  const rodKeys = ['MAGMA', 'INFERNO', 'HELLFIRE'];
  const rodAuctions = {
    MAGMA: [],
    INFERNO: [],
    HELLFIRE: [],
  };
  rodKeys.forEach((rod) => {
    rodAuctions[rod] = auctions.filter((a) => {
      return a.itemId === `${rod}_ROD` && checkAttribute(a, { id: attributeId, value: 1 });
    });
  });

  // shards
  const shardAuctions = auctions.filter((a) => {
    return a.itemId === 'ATTRIBUTE_SHARD' && checkAttribute(a, { id: attributeId, value: 1 });
  });

  return {
    armor: armorAuctions,
    molten: moltenAuctions,
    crimson: vanqAuctions,
    magmalord: magmalordAuctions,
    rods: rodAuctions,
    shards: shardAuctions,
  };
};

register('command', (itemId, attributeId1, attributeLevel1, attributeId2, attributeLevel2) => {
  ChatLib.chat(`${itemId}, ${attributeId1}, ${attributeLevel1}, ${attributeId2}, ${attributeLevel2}`);
  let isArmor = false;
  if (
    itemId.toLowerCase().includes('helmet') ||
    itemId.toLowerCase().includes('chestplate') ||
    itemId.toLowerCase().includes('leggings') ||
    itemId.toLowerCase().includes('boots')
  )
    isArmor = true;
  let attributeSearchQuery = [];
  if (attributeId1) {
    attributeSearchQuery.push({
      id: attributeId1,
      value: attributeLevel1 ? attributeLevel1 : 1,
    });
    if (attributeId2) {
      attributeSearchQuery.push({
        id: attributeId2,
        value: attributeLevel2 ? attributeLevel2 : 1,
      });
    }
  }
  const results = getPriceData(itemId, isArmor, attributeSearchQuery);
  if (isArmor) {
    ChatLib.chat('Type match');
    ChatLib.chat(` ${JSON.stringify(results[0][attributeId1][0])}`);

    ChatLib.chat('Exact match');
    ChatLib.chat(` ${JSON.stringify(results[1][attributeId1][0])}`);

    if ('both' in results[1]) {
      ChatLib.chat('Both');
      ChatLib.chat(` ${JSON.stringify(results[1]['both'][0])}`);
    }
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

register('command', (uuid) => {
  const auction = auctions.find((a) => a.uuid === uuid);
  ChatLib.chat(JSON.stringify(auction, null, 2));
  ChatLib.chat(`Index: ${auctions.findIndex((a) => a.uuid === uuid)}`);
}).setCommandName('debugauctionuuid');
