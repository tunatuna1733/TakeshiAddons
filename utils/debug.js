import RenderLib from "../../RenderLib";
import { getCurrentArea, getCurrentZone } from "./area";

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

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.item.EntityArmorStand').class).forEach((armorStand) => {
        const entity = new EntityLivingBase(armorStand.getEntity());
        const headNBT = entity.getItemInSlot(4)?.getRawNBT();
        ChatLib.chat(headNBT);
    });
}).setCommandName('debugarmorstandheads');

register('command', () => {
    const mapItem = Player.getInventory().getStackInSlot(8);
    if (mapItem) {
        ChatLib.chat(mapItem.getNBT());
    }
}).setCommandName('debugmapitemnbt');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.passive.EntityPig').class).forEach((e) => {
        const entity = new EntityLivingBase(e.getEntity());
        ChatLib.chat(entity.toString());
        ChatLib.chat(entity.getWidth());
        ChatLib.chat(entity.getHeight());
    })
}).setCommandName('debuglavaseacreature');

register('command', () => {
    ChatLib.chat(getCurrentArea());
    ChatLib.chat(getCurrentZone());
}).setCommandName('debugcurrentarea');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntityZombie').class).forEach((zombie) => {
        const entity = new EntityLivingBase(zombie.getEntity());
        const headItem = entity.getItemInSlot(4);
        const chestplateItem = entity.getItemInSlot(3);
        const leggingsItem = entity.getItemInSlot(2);
        const bootsItem = entity.getItemInSlot(1);
        ChatLib.chat(headItem?.getName());
        ChatLib.chat(chestplateItem?.getName());
        ChatLib.chat(leggingsItem?.getName());
        ChatLib.chat(bootsItem?.getName());
    });
}).setCommandName('debugmonsterarmor');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.passive.EntityWolf').class).forEach((wolf) => {
        const growingAge = wolf.getEntity().func_70874_b();
        ChatLib.chat(`${wolf.toString()}, ${wolf.getEntity().func_110143_aJ()}, ${wolf.getEntity().func_110138_aP()}`);
    });
}).setCommandName('debugwolf');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntitySpider').class).forEach((s) => {
        ChatLib.chat(`${s.toString()}, ${s.getEntity().func_110143_aJ()}, ${s.getEntity().func_110138_aP()}`);
    });
}).setCommandName('debugspider');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntityBlaze').class).forEach((e) => {
        ChatLib.chat(`${e.toString()}, ${e.getEntity().func_110143_aJ()}, ${e.getEntity().func_110138_aP()}`);
    });
}).setCommandName('debugblaze');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntityMagmaCube').class).forEach((e) => {
        ChatLib.chat(`${e.toString()}, ${e.getEntity().func_110143_aJ()}, ${e.getEntity().func_110138_aP()}, ${e.getEntity().field_70153_n}`);
    })
}).setCommandName('debugmagmacube');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntitySkeleton').class).forEach((e) => {
        ChatLib.chat(`${e.toString()}, ${e.getEntity().func_110143_aJ()}, ${e.getEntity().func_110138_aP()}, ${e.getEntity().func_82150_aj()}, ${e.getEntity().func_82202_m()}`);
    });
}).setCommandName('debugskeleton');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntityEnderman').class).forEach((e) => {
        ChatLib.chat(`${e.toString()}, ${e.getEntity().func_110143_aJ()}, ${e.getEntity().func_110138_aP()}`);
    });
}).setCommandName('debugenderman');

register('command', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.player.EntityPlayer').class).forEach((e) => {
        ChatLib.chat(`${e.toString()}, ${e.getEntity().func_110143_aJ()}, ${e.getEntity().func_110138_aP()}`);
        ChatLib.chat(e.getEntity().func_174819_aU() || '');
    });
}).setCommandName('debugplayer');

register('renderWorld', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.monster.EntityBlaze').class).forEach((s) => {
        const maxHp = s.getEntity().func_110138_aP();
        if (maxHp === 700000) {
            RenderLib.drawEspBox(
                s.getX(),
                s.getY(),
                s.getZ(),
                s.getWidth(),
                s.getHeight(),
                1, 0, 0, 1, true
            );
        }
    });
});

/*
register('renderWorld', () => {
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.passive.EntityWolf').class).forEach((wolf) => {
        const maxHp = wolf.getEntity().func_110138_aP();
        if (maxHp !== 250) {
            RenderLib.drawEspBox(
                wolf.getX(),
                wolf.getY(),
                wolf.getZ(),
                wolf.getWidth(),
                wolf.getHeight(),
                1, 0, 0, 1, true
            );
        }
    });
});
*/

/*
let particles = [];
let estimatedCoords = [];
const S2APacketParticles = Java.type("net.minecraft.network.play.server.S2APacketParticles");
register('packetReceived', (packet) => {
    if (packet instanceof S2APacketParticles) {
        if (packet.func_179749_a().toString() === 'FLAME') {
            if (Math.floor(packet.func_149226_e() * Math.pow(10, 3)) / Math.pow(10, 3) === 137.35 || Math.floor(packet.func_149226_e() * Math.pow(10, 3)) / Math.pow(10, 3) === 136.35) {
                if (Math.pow(-484.5 - packet.func_149226_e(), 2) > 7 * 7 && Math.pow(-1015.5 - packet.func_149225_f(), 2) > 7 * 7) {
                    if (typeof estimatedCoords.find(e => Math.sqrt(Math.pow(e.x - packet.func_149220_d(), 2)) > 10 && Math.sqrt(Math.pow(e.z - packet.func_149225_f(), 2)) > 10) === 'undefined') {
                        // ChatLib.chat(`pushed ${packet.func_149220_d()}, ${packet.func_149226_e()} ${packet.func_149225_f()}`);
                        estimatedCoords.push({ x: packet.func_149220_d(), y: packet.func_149226_e(), z: packet.func_149225_f() });
                    }
                    // particles.push({ x: packet.func_149220_d(), y: packet.func_149226_e(), z: packet.func_149225_f() });
                    // ChatLib.chat(`${packet.func_149221_g()}, ${packet.func_149224_h()}, ${packet.func_149223_i()}, ${packet.func_149227_j()}, ${packet.func_149222_k()}`);
                }
            }
        }
    }
});

register('renderWorld', () => {
    let renderParticles = [];
    particles.forEach((p) => {
        if (renderParticles.length === 0) {
            renderParticles.push(p);
        } else if (renderParticles.length === 1) {
            if (Math.sqrt(Math.pow(renderParticles[0].x - p.x, 2)) > 10 &&
                Math.sqrt(Math.pow(renderParticles[0].z - p.z, 2)) > 10
            ) {
                renderParticles.push(p);
            }
        } else if (renderParticles.length === 2) {
            if (Math.sqrt(Math.pow(renderParticles[0].x - p.x, 2)) > 10 &&
                Math.sqrt(Math.pow(renderParticles[0].z - p.z, 2)) > 10 &&
                Math.sqrt(Math.pow(renderParticles[1].x - p.x, 2)) > 10 &&
                Math.sqrt(Math.pow(renderParticles[1].z - p.z, 2)) > 10
            ) {
                renderParticles.push(p);
            }
        }
    });
    estimatedCoords.forEach((p) => {
        // ChatLib.chat(`${p.x} ${p.y} ${p.z}`);
        // renderBeaconBeam(p.x, p.y, p.z, 1, 1, 1, 1, false, 100);
    });
    particles = [];
});
*/