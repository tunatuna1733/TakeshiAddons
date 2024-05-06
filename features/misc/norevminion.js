import settings from "../../settings";
import { getCurrentArea } from "../../utils/area";
import { registerWhen } from "../../utils/register";

const EntityZombie = Java.type('net.minecraft.entity.monster.EntityZombie');

registerWhen(register('renderEntity', (e, pos, ticks, event) => {
    //if (e instanceof EntityZombie) {
    const livingEntity = new EntityLivingBase(e.entity);
    if (livingEntity.getItemInSlot(3)?.getName()?.removeFormatting() === 'Diamond Chestplate') {
        cancel(event);
    }
    //}
}).setFilteredClass(EntityZombie.class), () => settings.norevminion && getCurrentArea() === 'Private Island', { type: 'renderEntity', name: 'No Rev Minions' });