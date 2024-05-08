import settings from "../../settings";
import { inM7 } from "../../utils/dungeon";
import { registerWhen } from "../../utils/register";
import { getPing } from "../hud/ping";
const GuiChest = Java.type('net.minecraft.client.gui.inventory.GuiChest');

registerWhen(register('guiOpened', (e) => {
    Client.scheduleTask(1, () => {
        if (GuiChest.class.isInstance(e.gui) && Player.getInventory()?.getName() === 'Click the button on time!') {
            ChatLib.command(`pc ${settings.melodytext} Ping: ${getPing()}ms`);
        }
    });
}), () => settings.melodyannounce && inM7(), { type: 'guiOpened', name: 'Melody' });

registerWhen(register('postGuiRender', (x, y, gui) => {

}), () => settings.melodyannounce, { type: 'postGuiRender', name: 'Melody' })