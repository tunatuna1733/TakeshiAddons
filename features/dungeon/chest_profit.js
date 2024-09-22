import {
  enchantedBookNameList,
  enchantedBookNameWithoutLevel,
  m7MustOpen,
  m7NotRNGLootNames,
  m7NotRNGLoots,
} from '../../data/m7loot';
import settings from '../../settings';
import { data } from '../../utils/data';
import formatNumToCoin from '../../utils/format_coin';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from '../../utils/item_id';
import { decodeNumeral } from '../../utils/number';
import { registerWhen } from '../../utils/register';
const GuiChest = Java.type('net.minecraft.client.gui.inventory.GuiChest');

const chestProfitHud = new Hud(
  'chestprofit',
  'Dungeon Chest Profit',
  hud_manager,
  data
);

const chestVariants = [
  'Wood Chest',
  'Gold Chest',
  'Diamond Chest',
  'Emerald Chest',
  'Obsidian Chest',
  'Bedrock Chest',
];
const colorCodes = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
];
let currentColorCodeIndex = 0;

/**
 * Get enchant of the enchanted book.
 * @param {Item} ebook
 */
const getEnchantBookDetail = (ebook) => {
  const nbt = ebook.getNBT();
  const enchantName = Object.keys(
    nbt.getCompoundTag('tag').getCompoundTag('ExtraAttributes').toObject()[
      'enchantments'
    ]
  )[0];
  const enchantLevel = nbt
    .getCompoundTag('tag')
    .getCompoundTag('ExtraAttributes')
    .toObject()['enchantments'][enchantName];
  return {
    name: enchantName,
    level: enchantLevel,
  };
};

registerWhen(
  register('postGuiRender', (x, y, gui) => {
    if (
      GuiChest.class.isInstance(gui) &&
      Player.getContainer() &&
      chestVariants.includes(Player.getContainer().getName())
    ) {
      let rewardClickItemLores;
      let chestCost = 0;
      let totalPrice = 0;
      let rewardItems = [];
      let shouldOpen = false;
      let includeMustOpen = false;
      let mustBuyItem = '';
      let includeShiny = false;
      let priceList = [];
      Player.getContainer()
        .getItems()
        .forEach((item) => {
          if (
            item &&
            item.getName().removeFormatting().includes('Open Reward Chest')
          )
            rewardClickItemLores = item.getLore();
        });
      if (!rewardClickItemLores) return;
      rewardClickItemLores.forEach((lore, i) => {
        if (lore.removeFormatting() === 'Cost') {
          if (rewardClickItemLores[i + 1].removeFormatting() !== 'FREE')
            chestCost = parseInt(
              rewardClickItemLores[i + 1]
                .removeFormatting()
                .replaceAll(',', '')
                .replace(' Coins', '')
            );
        }
      });
      for (let i = 9; i < 18; i++) {
        if (Player.getContainer().getStackInSlot(i).getName() !== '') {
          rewardItems.push(Player.getContainer().getStackInSlot(i));
        }
      }
      rewardItems.forEach((item) => {
        const itemId = getItemId(item);
        if (item.getName().removeFormatting().includes('Shiny'))
          includeShiny = true;
        if (itemId === 'ENCHANTED_BOOK') {
          const enchant = getEnchantBookDetail(item);
          if (enchant.name === 'thunderlord') {
            includeMustOpen = true;
            mustBuyItem = '&4Thunderlord 7';
          } else {
            if (Object.keys(enchantedBookNameList).includes(enchant.name)) {
              let price = 0;
              m7NotRNGLootNames.forEach((l) => {
                if (l.name === enchantedBookNameList[enchant.name])
                  price = parseInt(l.price);
              });
              price = price * Math.pow(2, enchant.level - 1);
              priceList.push({
                name: enchantedBookNameList[enchant.name],
                isEnchantedBook: true,
                level: enchant.level,
                price,
              });
            }
          }
        } else if (Object.keys(m7MustOpen).includes(itemId)) {
          includeMustOpen = true;
          mustBuyItem = m7MustOpen[itemId];
        } else if (Object.keys(m7NotRNGLoots).includes(itemId)) {
          let price = 0;
          m7NotRNGLootNames.forEach((l) => {
            if (l.name === m7NotRNGLoots[itemId]) price = parseInt(l.price);
          });
          priceList.push({
            name: m7NotRNGLoots[itemId],
            isEnchantedBook: false,
            price,
          });
        }
      });
      priceList.forEach((p) => {
        totalPrice += p.price;
      });
      if (totalPrice > chestCost) shouldOpen = true;
      const [renderX, renderY] = chestProfitHud.getCoords();
      if (includeMustOpen) {
        Renderer.drawString('Must Open', renderX, renderY);
        Renderer.drawString(
          ` &${colorCodes[currentColorCodeIndex]}${mustBuyItem.removeFormatting()}`,
          renderX,
          renderY + 20
        );
      } else {
        if (shouldOpen) {
          Renderer.drawString('&aOpen Chest', renderX, renderY);
        } else {
          Renderer.drawString("&cDon't Open Chest!", renderX, renderY);
        }
        Renderer.drawString(
          ` &aProfit: ${shouldOpen ? '&a' : '&c'}${formatNumToCoin(totalPrice - chestCost)}`,
          renderX,
          renderY + 10
        );
        if (includeShiny) {
          Renderer.drawString(' &cS&6h&ei&an&9y&1!&d!', renderX, renderY + 20);
        }
        priceList.forEach((p, i) => {
          if (p.isEnchantedBook)
            Renderer.drawString(
              `  ${p.name.replace(' 1', '')} ${p.level}&r: &6${formatNumToCoin(p.price)}`,
              renderX,
              renderY + 30 + i * 10
            );
          else
            Renderer.drawString(
              `  ${p.name}&r: &6${formatNumToCoin(p.price)}`,
              renderX,
              renderY + 30 + i * 10
            );
        });
      }
    } else if (
      GuiChest.class.isInstance(gui) &&
      Player.getContainer() &&
      Player.getContainer().getName() === 'Master Mode Catacombs - Floor V'
    ) {
      // its wierd that the name of the container is floor v ??? (looks like the limit of the number of letters)
      let rewardTexts = [];
      Player.getContainer()
        .getItems()
        .forEach((rewardChest) => {
          if (rewardChest) {
            if (
              rewardChest.getName().removeFormatting() === 'Obsidian Chest' ||
              rewardChest.getName().removeFormatting() === 'Bedrock Chest'
            ) {
              let eachChestTexts = [];
              eachChestTexts.push(rewardChest.getName());
              eachChestTexts.push('Profit'); // profit
              eachChestTexts.push('Shiny'); // shiny
              let totalPrice = 0;
              let chestCost = 0;
              let includeMustOpen = false;
              let mustOpenItem = '';
              let includeShiny = false;
              let alreadyOpened = false;
              const lores = rewardChest.getLore();
              lores.forEach((lore) => {
                if (lore.removeFormatting().includes('Shiny'))
                  includeShiny = true;
                if (
                  Object.values(m7MustOpen).includes(lore.removeFormatting())
                ) {
                  includeMustOpen = true;
                  mustOpenItem = lore;
                }
                if (!includeMustOpen) {
                  if (lore.removeFormatting().includes('Enchanted Book')) {
                    let found = false;
                    Object.keys(enchantedBookNameWithoutLevel).forEach((e) => {
                      if (lore.removeFormatting().includes(e)) {
                        found = true;
                        const name =
                          enchantedBookNameList[
                            enchantedBookNameWithoutLevel[e]
                          ];
                        let level = 0;
                        const levelText = lore
                          .removeFormatting()
                          .replace(`Enchanted Book (${e} `, '')
                          .replace(')', '');
                        if (['1', '2', '3'].includes(levelText))
                          level = parseInt(levelText);
                        else
                          level = decodeNumeral(
                            lore
                              .removeFormatting()
                              .replace(`Enchanted Book (${e} `, '')
                              .replace(')', '')
                          );
                        let price = 0;
                        m7NotRNGLootNames.forEach((loot) => {
                          if (loot.name === name) price = parseInt(loot.price);
                        });
                        price = price * Math.pow(2, level - 1);
                        eachChestTexts.push(
                          `  ${name.replace(' 1', '')} ${level}&r: &6${formatNumToCoin(price)}`
                        );
                        totalPrice += price;
                      }
                    });
                    if (
                      !found &&
                      lore.removeFormatting().includes('Thunderlord')
                    ) {
                      includeMustOpen = true;
                      mustOpenItem = 'Thunderlord 7';
                    }
                  } else if (
                    Object.values(m7NotRNGLoots).includes(
                      lore.replace('§5§o', '').replace('§', '&')
                    )
                  ) {
                    m7NotRNGLootNames.forEach((loot) => {
                      if (
                        loot.name === lore.replace('§5§o', '').replace('§', '&')
                      ) {
                        eachChestTexts.push(
                          `  ${loot.name}&r: &6${formatNumToCoin(parseInt(loot.price))}`
                        );
                        totalPrice += parseInt(loot.price);
                      }
                    });
                  }
                }
                if (lore.removeFormatting().includes('Coins')) {
                  chestCost = parseInt(
                    lore
                      .removeFormatting()
                      .replaceAll(',', '')
                      .replace(' Coins', '')
                  );
                } else if (lore.removeFormatting() === 'Already opened!') {
                  alreadyOpened = true;
                }
              });
              const shouldOpen = totalPrice > chestCost;
              eachChestTexts[1] = alreadyOpened
                ? '  &aAlready Opened!'
                : `  &aProfit: ${shouldOpen ? '&a' : '&c'}${formatNumToCoin(totalPrice - chestCost)}`;
              eachChestTexts[2] = includeShiny ? ' &cS&6h&ei&an&9y&1!&d!' : '';
              if (includeMustOpen) {
                eachChestTexts = [
                  rewardChest.getName(),
                  ` &${colorCodes[currentColorCodeIndex]}${mustOpenItem.removeFormatting()} !!!!!!`,
                  ` ${includeShiny ? ' &cS&6h&ei&an&9y&1!&d!' : ''}`,
                ];
              }
              rewardTexts.push(eachChestTexts);
            }
          }
        });
      const [renderX, renderY] = chestProfitHud.getCoords();
      let currentY = renderY;
      const interval = 10;
      rewardTexts.forEach((texts) => {
        texts.forEach((text) => {
          Renderer.drawString(text, renderX, currentY);
          currentY += interval;
        });
        Renderer.drawString('', renderX, (currentY += interval));
        Renderer.drawString('', renderX, (currentY += interval));
      });
    }
  }),
  () => settings.dungeonchestprofit,
  { type: 'postGuiRender', name: 'Dungeon Chest Profit' }
);

registerWhen(
  register('step', () => {
    currentColorCodeIndex++;
    if (currentColorCodeIndex === colorCodes.length) currentColorCodeIndex = 0;
  }).setFps(2),
  () => settings.dungeonchestprofit,
  { type: 'step', name: 'Dungeon Chest Profit' }
);
