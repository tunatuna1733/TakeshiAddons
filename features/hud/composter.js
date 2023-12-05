import settings from "../../settings";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { isInGarden, isInSkyblock } from "../../utils/hypixel";
import { registerWhen } from "../../utils/register";

const composterHud = new Hud('composter', '&60h0d0s', hud_manager);

let guiOpen = false;

let organicMatter = 0;
let fuel = 0;

register('tick', () => {
    if (!isInSkyblock() || !isInGarden()) return;
    const tablistEntries = TabList.getNames();
    if (!tablistEntries) return;
    let isComposterLine = false;
    tablistEntries.forEach((line) => {
        if (line.includes('§b§lComposter:')) isComposterLine = true;
        if (isComposterLine) {
            if (line.removeFormatting().includes('Organic Matter:'));   // TODO: assign organicMatter
            else if (line.removeFormatting().includes('Fuel:'));    // TODO: assign fuel
        }
    });
});

register('postGuiRender', () => {
    const inventory = Player.getContainer();
    if (!guiOpen && inventory && inventory.getName() === 'Composter Upgrades') {
        guiOpen = true;
        const guiLoaded = register('tick', () => {
            if (inventory.getStackInSlot(inventory.getSize() - 37) == null) return;
            guiLoaded.unregister();
            // capture upgrade value and save in new pogobject
            // make sure that item in specific slot is not null and match regex pattern
        })
    }
});

registerWhen(register('renderOverlay', () => {

}), () => settings.composter);

register('guiClosed', () => {
    guiOpen = false;
});