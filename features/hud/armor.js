import settings from "../../settings";
import { data } from "../../utils/data";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";
import { ArmorHud } from "../../utils/armor_hud";
import { getCurrentArmor } from "../../utils/current_armor";

const armorHud = new ArmorHud('armor', hud_manager, data);

const moduleName = 'Armor HUD';

registerWhen(register("renderOverlay", () => {
    const [helmet, chestplate, leggings, boots] = getCurrentArmor();
    armorHud.draw(helmet, chestplate, leggings, boots);
}), () => settings.armorhud, { type: 'renderOverlay', name: moduleName });
