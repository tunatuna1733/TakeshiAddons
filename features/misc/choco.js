import renderBeaconBeam from "../../../BeaconBeam";
import RenderLib from "../../../RenderLib";

import settings from "../../settings";
import { registerWhen } from "../../utils/register";

const Color = Java.type('java.awt.Color');
const EntityArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');

const blueEggNbt = 'ewogICJ0aW1lc3RhbXAiIDogMTcxMTQ2MjU2ODExMiwKICAicHJvZmlsZUlkIiA6ICI3NzUwYzFhNTM5M2Q0ZWQ0Yjc2NmQ4ZGUwOWY4MjU0NiIsCiAgInByb2ZpbGVOYW1lIiA6ICJSZWVkcmVsIiwKICAic2lnbmF0dXJlUmVxdWlyZWQiIDogdHJ1ZSwKICAidGV4dHVyZXMiIDogewogICAgIlNLSU4iIDogewogICAgICAidXJsIiA6ICJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzdhZTZkMmQzMWQ4MTY3YmNhZjk1MjkzYjY4YTRhY2Q4NzJkNjZlNzUxZGI1YTM0ZjJjYmM2NzY2YTAzNTZkMGEiCiAgICB9CiAgfQp9';
const greenEggNbt = 'ewogICJ0aW1lc3RhbXAiIDogMTcxMTQ2MjY0OTcwMSwKICAicHJvZmlsZUlkIiA6ICI3NGEwMzQxNWY1OTI0ZTA4YjMyMGM2MmU1NGE3ZjJhYiIsCiAgInByb2ZpbGVOYW1lIiA6ICJNZXp6aXIiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTVlMzYxNjU4MTlmZDI4NTBmOTg1NTJlZGNkNzYzZmY5ODYzMTMxMTkyODNjMTI2YWNlMGM0Y2M0OTVlNzZhOCIKICAgIH0KICB9Cn0';
const goldEggNbt = 'ewogICJ0aW1lc3RhbXAiIDogMTcxMTQ2MjY3MzE0OSwKICAicHJvZmlsZUlkIiA6ICJiN2I4ZTlhZjEwZGE0NjFmOTY2YTQxM2RmOWJiM2U4OCIsCiAgInByb2ZpbGVOYW1lIiA6ICJBbmFiYW5hbmFZZzciLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTQ5MzMzZDg1YjhhMzE1ZDAzMzZlYjJkZjM3ZDhhNzE0Y2EyNGM1MWI4YzYwNzRmMWI1YjkyN2RlYjUxNmMyNCIKICAgIH0KICB9Cn0';

const defaultEggState = {
    x: 0,
    y: 0,
    z: 0,
    found: false,
    got: false
};

let currentEggState = {
    blue: defaultEggState,
    green: defaultEggState,
    gold: defaultEggState
};

registerWhen(register('chat', (eggtype) => {
    if (eggtype === 'Breakfast') {
        currentEggState.gold.found = false;
    } else if (eggtype === 'Lunch') {
        currentEggState.blue.found = false;
    } else if (eggtype === 'Dinner') {
        currentEggState.green.found = false;
    }
}).setChatCriteria("HOPPITY'S HUNT A Chocolate ${eggtype} Egg has appeared!"), () => settings.chocolatelocation, { type: 'chat', name: 'Chocolate Egg' });

registerWhen(register('chat', (eggtype) => {
    if (eggtype === 'Breakfast') {
        currentEggState.gold.got = true;
    } else if (eggtype === 'Lunch') {
        currentEggState.blue.got = true;
    } else if (eggtype === 'Dinner') {
        currentEggState.green.got = true;
    }
}).setChatCriteria("HOPPITY'S HUNT You found a Chocolate ${eggtype} Egg ${location}!"), () => settings.chocolatelocation, { type: 'chat', name: 'Chocolate Egg' });

registerWhen(register('step', () => {
    World.getAllEntitiesOfType(EntityArmorStand.class).forEach(e => {
        const livingEntity = new EntityLivingBase(e.getEntity());
        const headNbt = livingEntity.getItemInSlot(4)?.getRawNBT();
        if (headNbt) {
            if (headNbt.includes(blueEggNbt) && !currentEggState.blue.found) {
                currentEggState.blue = {
                    x: livingEntity.getX(),
                    y: livingEntity.getY(),
                    z: livingEntity.getZ(),
                    found: true
                };
            }
            if (headNbt.includes(greenEggNbt) && !currentEggState.green.found) {
                currentEggState.green = {
                    x: livingEntity.getX(),
                    y: livingEntity.getY(),
                    z: livingEntity.getZ(),
                    found: true
                };
            }
            if (headNbt.includes(goldEggNbt) && !currentEggState.gold.found) {
                currentEggState.gold = {
                    x: livingEntity.getX(),
                    y: livingEntity.getY(),
                    z: livingEntity.getZ(),
                    found: true
                };
            }
        }
    })
}).setDelay(5), () => settings.chocolatelocation, { type: 'step', name: 'Chocolate Egg' });

registerWhen(register('renderWorld', () => {
    if (currentEggState.blue.found && !currentEggState.blue.got) {
        renderBeaconBeam(
            currentEggState.blue.x - 0.5,
            currentEggState.blue.y + 1,
            currentEggState.blue.z - 0.5,
            Color.BLUE.getRed() / 255,
            Color.BLUE.getGreen() / 255,
            Color.BLUE.getBlue() / 255,
            Color.BLUE.getAlpha() / 255,
            false
        );
        RenderLib.drawEspBox(
            currentEggState.blue.x,
            currentEggState.blue.y + 1,
            currentEggState.blue.z,
            1, 1,
            Color.BLUE.getRed() / 255,
            Color.BLUE.getGreen() / 255,
            Color.BLUE.getBlue() / 255,
            Color.BLUE.getAlpha() / 255,
            true
        );
    }
    if (currentEggState.green.found && !currentEggState.green.got) {
        renderBeaconBeam(
            currentEggState.green.x - 0.5,
            currentEggState.green.y + 1,
            currentEggState.green.z - 0.5,
            Color.GREEN.getRed() / 255,
            Color.GREEN.getGreen() / 255,
            Color.GREEN.getBlue() / 255,
            Color.GREEN.getAlpha() / 255,
            false
        );
        RenderLib.drawEspBox(
            currentEggState.green.x,
            currentEggState.green.y + 1,
            currentEggState.green.z,
            1, 1,
            Color.GREEN.getRed() / 255,
            Color.GREEN.getGreen() / 255,
            Color.GREEN.getBlue() / 255,
            Color.GREEN.getAlpha() / 255,
            true
        );
    }
    if (currentEggState.gold.found && !currentEggState.gold.got) {
        renderBeaconBeam(
            currentEggState.gold.x - 0.5,
            currentEggState.gold.y + 1,
            currentEggState.gold.z - 0.5,
            Color.ORANGE.getRed() / 255,
            Color.ORANGE.getGreen() / 255,
            Color.ORANGE.getBlue() / 255,
            Color.ORANGE.getAlpha() / 255,
            false
        );
        RenderLib.drawEspBox(
            currentEggState.gold.x,
            currentEggState.gold.y + 1,
            currentEggState.gold.z,
            1, 1,
            Color.ORANGE.getRed() / 255,
            Color.ORANGE.getGreen() / 255,
            Color.ORANGE.getBlue() / 255,
            Color.ORANGE.getAlpha() / 255,
            true
        );
    }
}), () => settings.chocolatelocation, { type: 'renderWorld', name: 'Chocolate Egg' });

register('worldUnload', () => {
    currentEggState = {
        blue: defaultEggState,
        green: defaultEggState,
        gold: defaultEggState
    };
});