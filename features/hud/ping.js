import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

// Credit: https://discord.com/channels/119493402902528000/1109136691123454044/1228078055411417159
const C17PacketCustomPayload = net.minecraft.network.play.client.C17PacketCustomPayload;
const PacketBuffer = net.minecraft.network.PacketBuffer;
const Unpooled = Java.type('io.netty.buffer.Unpooled');
const System = java.lang.System;

const Color = Java.type('java.awt.Color');

const hypixelPing = new C17PacketCustomPayload("hypixel:ping", new PacketBuffer(Unpooled.buffer(1).writeByte(1)));
let time = 0;
let ping = 0;
let pings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const width = 100, height = 50;

const pingHud = new Hud('ping', '&ePing: &4500ms', hud_manager, data);

registerWhen(register('step', () => {
    Client.sendPacket(hypixelPing);
    time = System.nanoTime();
}).setDelay(1), () => settings.pinghud, { type: 'step', name: 'Ping Hud' });

registerWhen(register('packetReceived', packet => {
    if (packet.func_149169_c() == 'hypixel:ping') {
        ping = Math.floor((System.nanoTime() - time) / 1000000);
        pings.push(ping);
        if (pings.length > 20) pings.shift();
    }
}).setFilteredClass(net.minecraft.network.play.server.S3FPacketCustomPayload), () => settings.pinghud, { type: 'step', name: 'Ping Hud' });

registerWhen(register('renderOverlay', () => {
    const pingText = ping < 130 ? `&ePing: &a${ping}ms` : (ping < 180 ? `&ePing: &6${ping}ms` : `&ePing: &4${ping}ms`);
    pingHud.draw(pingText, false);
    const [x, y] = pingHud.getCoords();
    drawPingBox(x, y + 16 * pingHud.getScale());
}), () => settings.pinghud, { type: 'renderOverlay', name: 'Ping Hud' });

export const getPing = () => {
    return ping;
}

const calcMinAndMax = (min, max) => {
    const minLimit = min > 150 ? 150 : min > 100 ? 100 : 0;
    const maxLimit = max % 50 === 0 ? max : ((max - (max % 50)) / 50 + 1) * 50;
    return [minLimit, maxLimit];
}

const calcYOffset = (min, max, val, height) => {
    return (1 - (val - min) / (max - min)) * height;
}

const drawPingBox = (topX, topY) => {
    const x = topX + 30;
    const y = topY + 5;
    Renderer.drawLine(
        Color.WHITE.getRGB(),
        x, y, x + width, y, 1
    );
    Renderer.drawLine(
        Color.WHITE.getRGB(),
        x + width, y, x + width, y + height, 1
    );
    Renderer.drawLine(
        Color.WHITE.getRGB(),
        x, y + height, x + width, y + height, 1
    );
    Renderer.drawLine(
        Color.WHITE.getRGB(),
        x, y, x, y + height, 1
    );
    const [minLimit, maxLimit] = calcMinAndMax(Math.min(...pings), Math.max(...pings));
    Renderer.drawString(`${maxLimit}ms`, topX, topY);
    Renderer.drawString(`${minLimit}ms`, topX, topY + height);
    pings.forEach((p, i) => {
        if (i !== 0) {
            Renderer.drawLine(
                Color.cyan.getRGB(),
                x + width / 19 * (i - 1),
                y + calcYOffset(minLimit, maxLimit, pings[i - 1], height),
                x + width / 19 * i,
                y + calcYOffset(minLimit, maxLimit, p, height),
                1
            );
        }
    });
}

register('command', () => {
    ChatLib.chat(pings.toString());
    const [minLimit, maxLimit] = calcMinAndMax(Math.min(...pings), Math.max(...pings));
    ChatLib.chat(`${Math.min(...pings)} -> ${minLimit}, ${Math.max(...pings)} -> ${maxLimit}`);
}).setCommandName('debugpings');