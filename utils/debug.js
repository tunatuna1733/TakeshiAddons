// import renderBeaconBeam from "../../BeaconBeam";

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