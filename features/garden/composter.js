import numeral from 'numeraljs';

import settings from '../../settings';
import { data, gardenData } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import { inGarden, isInSkyblock } from '../../utils/hypixel';
import { decodeNumeral } from '../../utils/number';
import { registerWhen } from '../../utils/register';

const composterHud = new Hud('composter', '&600:00:00', hud_manager, data);

const moduleName = 'Composter HUD';

let guiOpen = false;

let previousOrganicMatter = 0;
let perviousFuel = 0;
let organicMatter = 0;
let fuel = 0;
let previousTablistEntries = [];

// Credit: SkyHanni
register('tick', () => {
  if (!isInSkyblock() || !inGarden() || !gardenData) return;
  const tablistEntries = TabList.getNames();
  if (!tablistEntries) return;
  if (previousTablistEntries === tablistEntries) return;
  previousTablistEntries = tablistEntries;
  let isComposterLine = false;
  tablistEntries.forEach((line) => {
    if (line.includes('§b§lComposter:')) isComposterLine = true;
    if (isComposterLine) {
      if (line.removeFormatting().includes('Organic Matter:')) {
        const shortNum = line
          .removeFormatting()
          .replace('Organic Matter: ', '');
        if (shortNum.endsWith('k')) {
          try {
            organicMatter = parseInt(shortNum.replace('k', '')) * 1000;
          } catch (e) {
            console.log(`Could not parse organic matter number\n${e}`);
          }
        } else {
          try {
            organicMatter = parseInt(shortNum);
          } catch (e) {
            console.log(`Could not parse organic matter number\n${e}`);
          }
        }
      } else if (line.removeFormatting().includes('Fuel:')) {
        const shortNum = line.removeFormatting().replace('Fuel: ', '');
        if (shortNum.endsWith('k')) {
          try {
            fuel = parseInt(shortNum.replace('k', '')) * 1000;
          } catch (e) {
            console.log(`Could not parse fuel number\n${e}`);
          }
        } else {
          try {
            organicMatter = parseInt(shortNum);
          } catch (e) {
            console.log(`Could not parse fuel number\n${e}`);
          }
        }
      }
    }
  });
  if (organicMatter === previousOrganicMatter && fuel === perviousFuel) return;
  previousOrganicMatter = organicMatter;
  perviousFuel = fuel;
  const timePerCompost = (10 * 60) / (1.0 + gardenData.upgrades.speed * 0.2);
  const organicMatterRequired = 4000 * (1.0 - gardenData.upgrades.cost / 100);
  const fuelRequired = 2000 * (1.0 - gardenData.upgrades.cost / 100);
  const organicMatterRemaining = Math.floor(
    organicMatter / organicMatterRequired
  );
  const fuelRemaining = Math.floor(fuel / fuelRequired);
  const organicMatterEnd = timePerCompost * organicMatterRemaining;
  const fuelEnd = timePerCompost * fuelRemaining;
  gardenData.endTime =
    organicMatterEnd > fuelEnd
      ? fuelEnd + Date.now() / 1000
      : organicMatterEnd + Date.now() / 1000;
  gardenData.save();
});

register('postGuiRender', () => {
  const inventory = Player.getContainer();
  if (!guiOpen && inventory && inventory.getName() === 'Composter Upgrades') {
    guiOpen = true;
    const guiLoaded = register('tick', () => {
      if (inventory.getStackInSlot(inventory.getSize() - 37) == null) return;
      guiLoaded.unregister();
      const speedUpgradeItem = inventory.getStackInSlot(20);
      const fuelUpgradeItem = inventory.getStackInSlot(22);
      const organicUpgradeItem = inventory.getStackInSlot(23);
      const costUpgradeItem = inventory.getStackInSlot(24);
      if (
        !speedUpgradeItem ||
        !fuelUpgradeItem ||
        !organicUpgradeItem ||
        !costUpgradeItem
      )
        return;
      if (
        !speedUpgradeItem.getName().includes('Composter Speed') ||
        !fuelUpgradeItem.getName().includes('Fuel Cap') ||
        !organicUpgradeItem.getName().includes('Organic Matter Cap') ||
        !costUpgradeItem.getName().includes('Cost Reduction')
      )
        return;
      const speedUpgrade = decodeNumeral(
        speedUpgradeItem
          .getName()
          .removeFormatting()
          .replace('Composter Speed ', '')
      );
      const fuelUpgrade = decodeNumeral(
        fuelUpgradeItem.getName().removeFormatting().replace('Fuel Cap ', '')
      );
      const organicUpgrade = decodeNumeral(
        organicUpgradeItem
          .getName()
          .removeFormatting()
          .replace('Organic Matter Cap ', '')
      );
      const costUpgrade = decodeNumeral(
        costUpgradeItem
          .getName()
          .removeFormatting()
          .replace('Cost Reduction ', '')
      );
      if (speedUpgrade == null) gardenData.upgrades.speed = 0;
      else gardenData.upgrades.speed = speedUpgrade;
      if (fuelUpgrade == null) gardenData.upgrades.fuel = 0;
      else gardenData.upgrades.fuel = fuelUpgrade;
      if (organicUpgrade == null) gardenData.upgrades.organic = 0;
      else gardenData.upgrades.organic = organicUpgrade;
      if (costUpgrade == null) gardenData.upgrades.cost = 0;
      else gardenData.upgrades.cost = costUpgrade;
      gardenData.save();
    });
  }
});

registerWhen(
  register('renderOverlay', () => {
    const remainingTime = gardenData.endTime - Date.now() / 1000;
    if (remainingTime > 0) {
      const formattedTime = numeral(remainingTime).format('00:00:00');
      composterHud.draw(`&6${formattedTime}`);
    } else {
      composterHud.draw(`&6Organic or Fuel empty!`);
    }
  }),
  () => settings.composter,
  { type: 'renderOverlay', name: moduleName }
);

register('guiClosed', () => {
  guiOpen = false;
});
