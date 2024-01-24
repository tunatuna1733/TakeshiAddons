register('command', () => {
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
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.item.EntityArmorStand').class).forEach((armorStand) => {
        ChatLib.chat(`${armorStand.getName()}, ${isPest(armorStand.getName().removeFormatting())}`);
        ChatLib.chat(`${armorStand.getX()}, ${armorStand.getY()}, ${armorStand.getZ()}, ${armorStand.getWidth()}, ${armorStand.getHeight()}`);
    });
}).setCommandName('debugarmorstands');