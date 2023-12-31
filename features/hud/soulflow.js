import { request } from 'axios';
import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

const soulflowHud = new Hud('soulflow', '00000⸎', hud_manager, data);

const soulflowImage = new Image('Soulflow', 'https://wiki.hypixel.net/images/a/af/SkyBlock_items_soulflow.png');
let lastChecked = 0;
let soulflow = 0;

const updateSoulflow = () => {
    lastChecked = Date.now();
    request({
        url: `https://soulflow-api.tunatuna1733.workers.dev/soulflow?mcid=${Player.getName()}`
    }).then((res) => {
        const response = res.data;
        if (response.success === false) {
            console.log('[Takeshi] Could not get soulflow.');
            console.log(response.error);
            return;
        }
        soulflow = response.soulflow;
    }).catch((e) => {
        console.log('[Takeshi] Could not get soulflow.');
        console.log(e);
    });
}

registerWhen(register('step', () => {
    if (Date.now() - lastChecked < 55 * 1000) return;
    updateSoulflow();
}).setDelay(60), () => settings.soulflow);

registerWhen(register('worldLoad', () => {
    if (Date.now() - lastChecked < 30 * 1000) return;
    updateSoulflow();
}), () => settings.soulflow);

registerWhen(register('renderOverlay', () => {
    soulflowHud.draw(`${soulflow}⸎`);
    const coords = soulflowHud.getCoords();
    const size = 16 * soulflowHud.getScale();
    soulflowImage.draw(coords[0] - size, coords[1], size, size);
}), () => settings.soulflow);