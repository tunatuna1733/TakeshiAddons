import RenderLib from "../../../RenderLib";
import settings from "../../settings";
import { getCurrentArea } from "../../utils/area";
import getItemId from "../../utils/item_id";
import { registerWhen } from "../../utils/register";

const EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');
const EntityWolf = Java.type('net.minecraft.entity.passive.EntityWolf');
const EntityArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');
const Color = Java.type('java.awt.Color');

registerWhen(register('renderWorld', () => {
    World.getAllEntitiesOfType(EntityPlayer.class).forEach((e) => {
        const name = e.getName();
        if (name === 'Glacite Bowman' || name === 'Glacite Caver' || name === 'Glacite Mage') {
            RenderLib.drawEspBox(
                e.getX(),
                e.getY(),
                e.getZ(),
                e.getWidth(),
                e.getHeight(),
                settings.mineshaftmobboxcolor.getRed() / 255,
                settings.mineshaftmobboxcolor.getGreen() / 255,
                settings.mineshaftmobboxcolor.getBlue() / 255,
                settings.mineshaftmobboxcolor.getAlpha() / 255,
                true
            );
        }
    });
    World.getAllEntitiesOfType(EntityWolf.class).forEach((e) => {
        RenderLib.drawEspBox(
            e.getX(),
            e.getY(),
            e.getZ(),
            e.getWidth(),
            e.getHeight(),
            settings.mineshaftmobboxcolor.getRed() / 255,
            settings.mineshaftmobboxcolor.getGreen() / 255,
            settings.mineshaftmobboxcolor.getBlue() / 255,
            settings.mineshaftmobboxcolor.getAlpha() / 255,
            true
        );
    });
}), () => settings.mineshaftmobbox && getCurrentArea() === 'Mineshaft', { type: 'renderWorld', name: 'Mineshaft Mob Box' });


registerWhen(register('chat', () => {
    Client.showTitle(`&eMINESHAFT!!!!!`, '', 0, 20 * 3, 0);
    Client.showTitle(`&eMINESHAFT!!!!!`, '', 0, 20 * 3, 0);
    World.playSound('note.pling', 4, 1.5);
    if (settings.announcemineshaft) {
        ChatLib.command('pc [Takeshi] I found a mineshaft!!');
    }
}).setChatCriteria('WOW! You found a Glacite Mineshaft portal!'), () => settings.mineshaftmobbox && getCurrentArea() === 'Dwarven Mines', { type: 'chat', name: 'Mineshaft Notification' });

registerWhen(register('renderWorld', () => {
    World.getAllEntitiesOfType(EntityArmorStand.class).forEach(e => {
        const livingEntity = new EntityLivingBase(e.getEntity());
        const headItem = livingEntity.getItemInSlot(4);
        if (headItem) {
            const itemId = getItemId(headItem);
            const [x, y, z] = [livingEntity.getX(), livingEntity.getY(), livingEntity.getZ()];
            let variant = '';
            if (itemId === 'LAPIS_ARMOR_HELMET') {
                variant = 'Lapis';
            } else if (itemId === 'ARMOR_OF_YOG_HELMET') {
                variant = 'Umber';
            } else if (itemId === 'MINERAL_HELMET') {
                variant = 'Tungsten';
            }
            if (variant !== '') {
                let color;
                if (variant === 'Lapis') {
                    color = Color.BLUE;
                } else if (variant === 'Umber') {
                    color = Color.ORANGE;
                } else if (variant === 'Tungsten') {
                    color = Color.LIGHT_GRAY;
                }
                RenderLib.drawEspBox(
                    x, y, z,
                    1, 1,
                    color.getRed() / 255,
                    color.getGreen() / 255,
                    color.getBlue() / 255,
                    color.getAlpha() / 255,
                    true
                );
                Tessellator.drawString(
                    variant,
                    x, y, z,
                    color.getRGB()
                );
            }
        }
    });
}), () => settings.corpselocation && getCurrentArea() === 'Mineshaft', { type: 'renderWorld', name: 'Show corpses location' });
