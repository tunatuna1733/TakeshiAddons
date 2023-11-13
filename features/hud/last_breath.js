import settings from "../../settings";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import getItemId from "../../utils/item_id";
import { registerWhen } from "../../utils/register";

const lbHud = new Hud('lastbreath', '&6LastBreath: 0', hud_manager, data);

let lbIncludedInHotbar = false;
let lbIncludedInInventory = false;

let lbShooting = false;
let isDuplex = false;
let lbShotCount = 0;
let lbHitCount = 0;
let lbShotUnix = [];

let lbRecordStart = 0;
let isRecording = false;

registerWhen(register('step', () => {
    lbIncludedInHotbar = false;
    lbIncludedInInventory = false;
    if (Player.getInventory() !== null) {
        for (let i = 0; i < 9; i++) {
            const hotbarItem = Player.getInventory().getStackInSlot(i);
            if (hotbarItem) {
                try {
                    const itemID = hotbarItem.getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
                    if (itemID == 'LAST_BREATH' || itemID == 'STARRED_LAST_BREATH') lbIncludedInHotbar = true;
                } catch (e) {
                    // maybe not skyblock item ?
                }
            }
        }
        try {
            Player.getInventory().getItems().forEach((item) => {
                if (item) {
                    try {
                        const itemID = getItemId(item);
                        if (itemID == 'LAST_BREATH' || itemID == 'STARRED_LAST_BREATH') lbIncludedInInventory = true;
                    } catch (e) {
                        // maybe not skyblock item ?
                    }
                }
            });
        } catch (e) { }
    }
}).setDelay(1), () => settings.lbhud);

registerWhen(register(Java.type('net.minecraftforge.event.entity.player.ArrowNockEvent'), (e) => {
    if (Player.getHeldItem()) {
        const heldItemID = Player.getHeldItem().getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
        if (heldItemID === 'LAST_BREATH' || heldItemID === 'STARRED_LAST_BREATH') {
            isDuplex = false;
            Player.getHeldItem().getLore().forEach((lore) => {
                if (lore.includes('Duplex')) isDuplex = true;
            });
        }
    }
}), () => settings.lbhud);

registerWhen(register(Java.type('net.minecraftforge.event.entity.player.ArrowLooseEvent'), (e) => {
    if (Player.getHeldItem()) {
        const heldItemID = Player.getHeldItem().getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
        if (heldItemID === 'LAST_BREATH' || heldItemID === 'STARRED_LAST_BREATH') {
            lbShooting = true;
        }
    }
}), () => settings.lbhud);

registerWhen(register('soundPlay', (position, name) => {
    if (name === 'random.bow') {
        const current = Date.now();
        if (lbShooting) {
            if (!isDuplex) {
                lbShotCount++;
                lbShooting = false;
                lbShotUnix.push(current);
            } else {
                lbShotCount += 2;
                lbShooting = false;
                lbShotUnix.push(current);
                lbShotUnix.push(current);
            }
        }
    }
    if (name === 'random.successful_hit') {
        if (lbShotCount > 0) {
            lbShotCount--;
            lbHitCount++;
            lbShotUnix.splice(0, 1);
            if (!isRecording) {
                isRecording = true;
                lbRecordStart = Date.now();
            }
        }
    }
}), () => settings.lbhud);

registerWhen(register('renderOverlay', () => {
    const current = Date.now();
    lbShotUnix = lbShotUnix.filter(l => current - l < 4 * 1000);
    lbShotCount = lbShotUnix.length;
    if (current - lbRecordStart > settings.lbreset * 1000) {
        lbRecordStart = 0;
        isRecording = false;
        lbHitCount = 0;
    }
    if (lbIncludedInInventory) {
        if (settings.lbhotbar) {
            if (lbIncludedInHotbar) {
                lbHud.draw(`&6LastBreath: ${lbHitCount}`);
            }
        } else {
            lbHud.draw(`&6LastBreath: ${lbHitCount}`);
        }
    }
}), () => settings.lbhud);

register('worldUnload', () => {
    lbShooting = false;
    isDuplex = false;
    lbShotCount = 0;
    lbHitCount = 0;
    lbShotUnix = [];
});