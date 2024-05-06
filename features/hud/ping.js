import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

const C17PacketCustomPayload = net.minecraft.network.play.client.C17PacketCustomPayload;
const PacketBuffer = net.minecraft.network.PacketBuffer;
const Unpooled = Java.type('io.netty.buffer.Unpooled');
const System = java.lang.System;

const hypixelPing = new C17PacketCustomPayload("hypixel:ping", new PacketBuffer(Unpooled.buffer(1).writeByte(1)));
let time = 0;
let ping = 0;

const pingHud = new Hud('ping', '&ePing: &4500ms', hud_manager, data);

registerWhen(register('step', () => {
    Client.sendPacket(hypixelPing);
    time = System.nanoTime();
}).setDelay(1), () => settings.pinghud, { type: 'step', name: 'Ping Hud' });

registerWhen(register('packetReceived', packet => {
    if (packet.func_149169_c() == 'hypixel:ping') {
        ping = Math.floor((System.nanoTime() - time) / 1000000);
    }
}).setFilteredClass(net.minecraft.network.play.server.S3FPacketCustomPayload), () => settings.pinghud, { type: 'step', name: 'Ping Hud' });

registerWhen(register('renderOverlay', () => {
    const pingText = ping < 130 ? `&ePing: &a${ping}ms` : (ping < 180 ? `&ePing: &6${ping}ms` : `&ePing: &4${ping}ms`);
    pingHud.draw(pingText, false);
}), () => settings.pinghud, { type: 'renderOverlay', name: 'Ping Hud' });

export const getPing = () => {
    return ping;
}