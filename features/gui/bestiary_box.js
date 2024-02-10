import RenderLib from "../../../RenderLib";
import {
    ArmorStandClass,
    BlazeClass,
    CaveSpiderClass,
    ChickenClass,
    CowClass,
    CreeperClass,
    EndermanClass,
    EndermiteClass,
    IronGolemClass,
    MagmaCubeClass,
    MooshroomClass,
    PigClass,
    PigmanClass,
    PlayerClass,
    RabbitClass,
    SheepClass,
    SilverfishClass,
    SkeletonClass,
    SlimeClass,
    SpiderClass,
    WitchClass,
    WolfClass,
    ZombieClass
} from "../../data/bestiary_data";
import settings from "../../settings";
import { getCurrentArea } from "../../utils/area";
import { bestiaryData } from "../../utils/data";
import { registerWhen } from "../../utils/register";

const EntityZombie = Java.type('net.minecraft.entity.monster.EntityZombie');
const EntitySkeleton = Java.type('net.minecraft.entity.monster.EntitySkeleton');
const EntityCreeper = Java.type('net.minecraft.entity.monster.EntityCreeper');
const EntityEnderman = Java.type('net.minecraft.entity.monster.EntityEnderman');
const EntitySlime = Java.type('net.minecraft.entity.monster.EntitySlime');
const EntityMagmaCube = Java.type('net.minecraft.entity.monster.EntityMagmaCube');
const EntitySpider = Java.type('net.minecraft.entity.monster.EntitySpider');
const EntityCaveSpider = Java.type('net.minecraft.entity.monster.EntityCaveSpider');
const EntityWitch = Java.type('net.minecraft.entity.monster.EntityWitch');
const EntitySilverfish = Java.type('net.minecraft.entity.monster.EntitySilverfish');
const EntityBlaze = Java.type('net.minecraft.entity.monster.EntityBlaze');
const EntityEndermite = Java.type('net.minecraft.entity.monster.EntityEndermite');
const EntityPigman = Java.type('net.minecraft.entity.monster.EntityPigZombie');
const EntityIronGolem = Java.type('net.minecraft.entity.monster.EntityIronGolem');

const EntityWolf = Java.type('net.minecraft.entity.passive.EntityWolf');
const EntityChicken = Java.type('net.minecraft.entity.passive.EntityChicken');
const EntityCow = Java.type('net.minecraft.entity.passive.EntityCow');
const EntityMooshroom = Java.type('net.minecraft.entity.passive.EntityMooshroom');
const EntityPig = Java.type('net.minecraft.entity.passive.EntityPig');
const EntityRabbit = Java.type('net.minecraft.entity.passive.EntityRabbit');
const EntitySheep = Java.type('net.minecraft.entity.passive.EntitySheep');

const EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');

const EntityArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');

/**
 * Draw box around the entity.
 * @param {Entity} entity 
 */
const drawBox = (entity) => {
    RenderLib.drawEspBox(
        entity.getX(),
        entity.getY(),
        entity.getZ(),
        entity.getWidth(),
        entity.getHeight(),
        settings.mobboxcolor.getRed() / 255,
        settings.mobboxcolor.getGreen() / 255,
        settings.mobboxcolor.getBlue() / 255,
        settings.mobboxcolor.getAlpha() / 255,
        settings.mobboxesp
    );
};

const islandNameMap = {
    private: 'Private Island',
    hub: 'Hub',
    farming: 'The Farming Islands',
    spider: "Spider's Den",
    end: 'The End',
    nether: 'Crimson Isle',
    deep: 'Deep Caverns',
    dwarven: 'Dwarven Mines',
    crystal: 'Crystal Hollows',
    park: 'The Park'
}

const checkIsland = (island) => {
    const currentArea = getCurrentArea();
    return currentArea === islandNameMap[island];
}

const checkHealth = (entity, healths) => {
    let valid = false;
    const derpyMult = settings.mobboxderpy ? 2 : 1;
    healths.forEach((h) => {
        if (entity.getEntity().func_110143_aJ() === h * derpyMult ||     // getHealth
            entity.getEntity().func_110143_aJ() === h * derpyMult * 3 || // corrupted
            entity.getEntity().func_110143_aJ() === h * derpyMult * 4 || // runic
            entity.getEntity().func_110143_aJ() === h * derpyMult * 12   // c & r
        ) {
            if (!valid)
                valid = true;
        }
    });
    return valid;
}

registerWhen(register('renderWorld', () => {
    World.getAllEntities().forEach((entity) => {
        if (entity.getEntity() instanceof EntityZombie) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === ZombieClass);
            const livingEntity = new EntityLivingBase(entity.getEntity());
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    if (m.villager) {
                        if (entity.getEntity().func_82231_m()) {    // isVillager
                            if (m.armor) {
                                if (m.chestplate === livingEntity.getItemInSlot(3)?.getName()?.removeFormatting() &&
                                    m.leggings === livingEntity.getItemInSlot(2)?.getName()?.removeFormatting() &&
                                    m.boots === livingEntity.getItemInSlot(1)?.getName()?.removeFormatting()
                                ) {
                                    drawBox(entity);
                                }
                            } else {
                                drawBox(entity);
                            }
                        }
                    } else {
                        if (!entity.getEntity().func_82231_m()) {
                            if (m.armor) {
                                if (m.chestplate === livingEntity.getItemInSlot(3)?.getName()?.removeFormatting() &&
                                    m.leggings === livingEntity.getItemInSlot(2)?.getName()?.removeFormatting() &&
                                    m.boots === livingEntity.getItemInSlot(1)?.getName()?.removeFormatting()
                                ) {
                                    drawBox(entity);
                                }
                            } else {
                                drawBox(entity);
                            }
                        }
                    }
                }
            });
        } else if (entity.getEntity() instanceof EntitySkeleton) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === SkeletonClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    if (m.skeletonType === entity.getEntity().func_82202_m()) { // getSkeletonType
                        if (m.hasOwnProperty('isInvisible')) {
                            if (m.isInvisible === entity.getEntity().func_82150_aj()) { // isInvisible
                                drawBox(entity);
                            }
                        } else {
                            drawBox(entity);
                        }
                    }
                }
            });
        } else if (entity.getEntity() instanceof EntityCreeper) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === CreeperClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityEnderman) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === EndermanClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    if ('health' in m) {
                        if (checkHealth(entity, m.health)) {
                            drawBox(entity);
                        }
                    } else {
                        drawBox(entity);
                    }
                }
            });
        } else if (entity.getEntity() instanceof EntitySlime && !(entity.getEntity() instanceof EntityMagmaCube)) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === SlimeClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityMagmaCube) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === MagmaCubeClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    if ('health' in m) {
                        if (checkHealth(entity, m.health)) {
                            drawBox(entity);
                        }
                    } else {
                        drawBox(entity);
                    }
                }
            });
        } else if (entity.getEntity() instanceof EntitySpider && !(entity.getEntity() instanceof EntityCaveSpider)) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === SpiderClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityCaveSpider) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === CaveSpiderClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    if ('health' in m) {
                        if (checkHealth(entity, m.health)) {
                            drawBox(entity);
                        }
                    } else {
                        drawBox(entity);
                    }
                }
            });
        } else if (entity.getEntity() instanceof EntityWitch) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === WitchClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntitySilverfish) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === SilverfishClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityBlaze) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === BlazeClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    if ('health' in m) {
                        if (checkHealth(entity, m.health)) {
                            drawBox(entity);
                        }
                    } else {
                        drawBox(entity);
                    }
                }
            });
        } else if (entity.getEntity() instanceof EntityEndermite) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === EndermiteClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityPigman) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === PigmanClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityIronGolem) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === IronGolemClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityWolf) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === WolfClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    if ('health' in m) {
                        if (checkHealth(entity, m.health)) {
                            drawBox(entity);
                        }
                    } else {
                        drawBox(entity);
                    }
                }
            });
        } else if (entity.getEntity() instanceof EntityChicken) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === ChickenClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityCow) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === CowClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityMooshroom) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === MooshroomClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityPig) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === PigClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityRabbit) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === RabbitClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntitySheep) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === SheepClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    drawBox(entity);
                }
            });
        } else if (entity.getEntity() instanceof EntityPlayer) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === PlayerClass);
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    let drawn = false;
                    m.playerName.forEach((n) => {
                        if (entity.getName() === n) {
                            if (!drawn) {
                                drawBox(entity);
                                drawn = true;
                            }
                        }
                    });
                }
            });
        } else if (entity.getEntity() instanceof EntityArmorStand) {
            const filtered = bestiaryData.data.filter(m => m.mcclass === ArmorStandClass);
            const livingEntity = new EntityLivingBase(entity.getEntity());
            filtered.forEach((m) => {
                if (checkIsland(m.island)) {
                    const headNBT = livingEntity.getItemInSlot(4)?.getRawNBT();
                    if (headNBT.includes(m.encoded)) {
                        RenderLib.drawEspBox(
                            armorStand.getX(),
                            armorStand.getY() - 1,
                            armorStand.getZ(),
                            settings.mobboxcolor.getRed() / 255,
                            settings.mobboxcolor.getGreen() / 255,
                            settings.mobboxcolor.getBlue() / 255,
                            settings.mobboxcolor.getAlpha() / 255,
                            settings.mobboxesp
                        );
                    }
                }
            });
        }
    })
}), () => settings.mobbox, { type: 'renderWorld', name: 'Mob Box' });