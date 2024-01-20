import settings from "../../settings";
import { icespray, inM7 } from "../../utils/dungeon";
import getItemId from "../../utils/item_id";
import { registerWhen } from "../../utils/register";

const moduleName = 'Ice Spray';

let isIceSprayUsed = false;
let iceSprayTime = 0;

registerWhen(register('clicked', (x, y, button, isDown) => {
    if (!isDown || button !== 1) return;
    const heldItem = Player.getHeldItem();
    if (!heldItem) return;
    const heltItemId = getItemId(heldItem);
    if (heltItemId === 'ICE_SPRAY_WAND' && !isIceSprayUsed && Date.now() - iceSprayTime > 5 * 1000) {
        isIceSprayUsed = true;
        iceSprayTime = Date.now();
    }
}), () => (settings.icespray && inM7()), { type: 'clicked', name: moduleName });

registerWhen(register('renderWorld', () => {
    if (Date.now() - iceSprayTime > 5 * 1000) {
        // icespray = false;
        isIceSprayUsed = false;
        return;
    }
    if (!isIceSprayUsed) return;
    let iceDetected = false;
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.item.EntityArmorStand').class).forEach((armorStand) => {
        const entity = new EntityLivingBase(armorStand.getEntity());
        if (entity.getItemInSlot(0)?.getName() === 'Packed Ice') {
            iceDetected = true;
        }
    });
    let isIceSprayHit = false;
    if (iceDetected) {
        World.getAllEntitiesOfType(Java.type('net.minecraft.entity.boss.EntityDragon').class).forEach((dragon) => {
            const entity = new EntityLivingBase(dragon.getEntity());
            if (entity.getName() === 'Ender Dragon') {
                isIceSprayHit = true;
                // icespray = true;
            }
        });
    }
    if (isIceSprayHit) {
        Client.showTitle('&9ICE SPRAY HIT!', '', 0, 20, 0);
        World.playSound('note.pling', 4, 1.5);
        isIceSprayUsed = false;
    }
}), () => (settings.icespray && inM7()), { type: 'renderWorld', name: moduleName });