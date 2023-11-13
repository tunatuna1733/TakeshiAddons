import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

const reforgeHud = new Hud('reforge', 'Power: None', hud_manager, data);

registerWhen(register('chat', (power) => {
    data.reforge.power = power;
    data.save();
}).setChatCriteria('You selected the ${reforge} power for your Accessory Bag!'), () => true);

registerWhen(register("renderOverlay", () => {
    reforgeHud.draw(`Power: ${data.reforge.power}`);
}), () => settings.reforgehud);