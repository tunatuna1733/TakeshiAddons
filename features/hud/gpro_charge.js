import WebSocket from '../../../WebSocket';
import settings from '../../settings';
import { data } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import { registerWhen } from '../../utils/register';

let ws = new WebSocket('ws://localhost:9010');
const batteryHud = new Hud('gprobattery', '&6GPro: &c0&a%', hud_manager, data);

let deviceId = '';
let battery = 0;
let isCharging = false;

register('step', () => {
    if (deviceId !== '')
        ws.send(JSON.stringify({ path: `/battery/${deviceId}/state`, verb: 'GET' }));
}).setDelay(60);

registerWhen(register('renderOverlay', () => {
    const batteryText = battery < 20 ? `&c${battery}&a%` : `&a${battery}%`;
    const chargeText = isCharging ? '⚡' : '';
    batteryHud.draw(`&6GPro: ${batteryText}${chargeText}`);
}), () => settings.gprobattery, { type: 'renderOverlay', name: 'GPro Battery' });

ws.onOpen = () => {
    console.log('[Takeshi] Connected to WebSocket.');
    ws.send(JSON.stringify({ path: '/devices/list', verb: 'GET' }));
}

ws.onMessage = (msg) => {
    const json = JSON.parse(msg);
    console.dir(json, { depth: null });
    if (json.result.code !== 'SUCCESS') return;

    // device list
    if (json.path === '/devices/list') {
        const devices = json.payload.deviceInfos;
        devices.forEach((device) => {
            if (device.deviceBaseModel === 'pro_x_wireless_mouse') deviceId = device.id;
        });
        if (deviceId !== '') {
            ws.send(JSON.stringify({ path: `/battery/${deviceId}/state`, verb: 'GET' }));
        } else {
            setTimeout(() => {
                ws.send(JSON.stringify({ path: '/devices/list', verb: 'GET' }));
            }, 60 * 1000);
        }
    }

    // battery
    if (json.path.includes('/battery/')) {
        battery = json.payload.percentage;
        isCharging = json.payload.charging;
    }
}

ws.onError = (err) => {
    console.log(`[Takeshi] WebSocket Error: ${err}`);
}

ws.connect();