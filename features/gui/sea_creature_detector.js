import RenderLib from "../../../RenderLib";
import renderBeaconBeam from "../../../BeaconBeam";
import settings from "../../settings";
import { getCurrentArea } from "../../utils/area";
import { registerWhen } from "../../utils/register";

const fireeelTexture = 'ewogICJ0aW1lc3RhbXAiIDogMTY0MzgzMTA5NzU4NywKICAicHJvZmlsZUlkIiA6ICJmMjU5MTFiOTZkZDU0MjJhYTcwNzNiOTBmOGI4MTUyMyIsCiAgInByb2ZpbGVOYW1lIiA6ICJmYXJsb3VjaDEwMCIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS9jNjM3MDRhN2ZjN2Q0MzdmN2I5MjNlMjNlOWEwOGFlM2JiZTI4OTM3ZGY0ZGFmYTllM2U4NzI1YjJjZTRhZmE1IgogICAgfQogIH0KfQ=';

/**
 * Draws box around given entity.
 * @param {Entity} entity 
 */
const renderEntityBox = (entity, r, g, b, a, esp = false) => {
    RenderLib.drawEspBox(
        entity.getX(),
        entity.getY(),
        entity.getZ(),
        entity.getWidth(),
        entity.getHeight(),
        r, g, b, a, esp
    );
}

registerWhen(register('renderWorld', () => {
    const holdingItem = Player?.getHeldItem();
    if (!settings.fishingrodstoprender || (settings.fishingrodstoprender && !(holdingItem && holdingItem.getID() === 346))) {
        World.getAllEntities().forEach((entity) => {
            // Moogma
            if (entity.getEntity() instanceof Java.type('net.minecraft.entity.passive.EntityMooshroom')) {
                if (!(entity.getX() > -285 && entity.getZ() < -660)) {
                    renderEntityBox(entity, 0.2, 0.2, 1, 1, settings.seacreatureesp);
                }
            }

            // Magma cube mobs
            if (entity.getEntity() instanceof Java.type('net.minecraft.entity.monster.EntityMagmaCube')) {
                if (Math.round(entity.getWidth() * 100) / 100 === 1.53) {
                    if (!(
                        -482 <= entity.getX() &&
                        entity.getX() <= -385 &&
                        52 <= entity.getY() &&
                        entity.getY() <= 75 &&
                        -720 <= entity.getZ() &&
                        entity.getZ() <= -647
                    ) && !(
                        -440 <= entity.getX() &&
                        entity.getX() <= -321 &&
                        73 <= entity.getY() &&
                        entity.getY() <= 94 &&
                        -985 <= entity.getZ() &&
                        entity.getZ() <= -897
                    ))
                        renderEntityBox(entity, 0.2, 0.2, 1, 1, settings.seacreatureesp);
                }
            }

            // Lava Leech
            if (entity.getEntity() instanceof Java.type('net.minecraft.entity.monster.EntityEndermite')) {
                renderEntityBox(entity, 0.2, 0.2, 1, 1, settings.seacreatureesp);
            }

            // Taurus
            if (entity.getEntity() instanceof Java.type('net.minecraft.entity.passive.EntityPig')) {
                if (!(entity.getX() === -699.5 && entity.getY() === 131 && entity.getZ() === -887.5)) { // Sirih check
                    renderEntityBox(entity, 0.2, 0.2, 1, 1, settings.seacreatureesp);
                }
            }

            // Thunder
            if (entity.getEntity() instanceof Java.type('net.minecraft.entity.monster.EntityGuardian')) {
                if (entity.getEntity().func_175461_cl()) {  // isElder
                    renderEntityBox(entity, 1, 0.4, 1, 1, settings.seacreatureesp);
                }
            }

            if (entity.getEntity() instanceof Java.type('net.minecraft.entity.item.EntityArmorStand')) {
                const armorStand = new EntityLivingBase(entity.getEntity());
                const headNbt = armorStand.getItemInSlot(4)?.getRawNBT();
                if (headNbt && headNbt.includes(fireeelTexture)) {
                    renderEntityBox(entity, 0.2, 0.2, 1, 1, settings.seacreatureesp);
                }
            }
        });
    }
}), () => settings.seacreature && getCurrentArea() === 'Crimson Isle', { type: 'renderWorld', name: 'SeaCreature Detect' });

registerWhen(register('renderWorld', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntityIronGolem').class).forEach((irongolem) => {
        renderBeaconBeam(
            irongolem.getX(),
            irongolem.getY(),
            irongolem.getZ(),
            1, 0.4, 1, 1, false, 200
        );
    });
}), () => settings.jawbuswaypoint && getCurrentArea() === 'Crimson Isle', { type: 'renderWorld', name: 'Jawbus Waypoint' });