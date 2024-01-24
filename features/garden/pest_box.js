import RenderLib from "../../../RenderLib";
import settings from "../../settings";
import { inGarden } from "../../utils/hypixel";
import { registerWhen } from "../../utils/register";

const pestNames = ['Beetle', 'Cricket', 'Fly', 'Locust', 'Mite', 'Mosquito', 'Moth', 'Rat', 'Slug', 'Earthworm'];

const isPest = (name) => {
    // Pest Icon: ൠ
    let isPestName = false;
    pestNames.forEach((pest) => {
        if (name.includes(pest)) isPestName = true;
    });
    if (isPestName) {
        if (name.includes('❤')) return true;
        else return false;
    } else return false;
}

registerWhen(register('renderWorld', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.item.EntityArmorStand').class).forEach((armorStand) => {
        if (isPest(armorStand.getName().removeFormatting())) {
            RenderLib.drawEspBox(
                armorStand.getX(),
                armorStand.getY() - 0.5,
                armorStand.getZ(),
                1.0,
                1.0,
                settings.pestboxcolor.getRed() / 255,
                settings.pestboxcolor.getGreen() / 255,
                settings.pestboxcolor.getBlue() / 255,
                settings.pestboxcolor.getAlpha() / 255,
                settings.pestboxesp
            );
        }
    });
}), () => (settings.pestbox && inGarden()), { type: 'renderWorld', name: 'Pest Box' });