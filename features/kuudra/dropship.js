import settings from "../../settings";
import { getCurrentArea } from "../../utils/area";
import { data } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { registerWhen } from "../../utils/register";

const dropshipHud = new Hud('dropship', '&aBomb drops in &60s', hud_manager, data);

const moduleName = 'Dropship HUD';

let isDropshipApproaching = false;
let dropshipTimer = 0;
let warned = false;
const explosionTime = 48 * 1000;

registerWhen(register('renderOverlay', () => {
    let warnTime = settings.dropshiptime * 1000;
    if (isDropshipApproaching && Player.getY() > 20) {
        if (Date.now() - dropshipTimer > explosionTime) {
            isDropshipApproaching = false;
            warned = false;
        } else {
            dropshipHud.draw(`&aBomb drops in &6${((explosionTime - (Date.now() - dropshipTimer)) / 1000).toFixed(1)}s`);
            if (Date.now() - dropshipTimer > (explosionTime - warnTime) && !warned) {
                World.playSound('note.pling', 4, 1.5);
                Client.showTitle(`&cBomb Drop in ${settings.dropshiptime} secs!`, '', 0, 3 * 20, 0);
                if (settings.senddropshipwarning) ChatLib.command(`pc Bomb drops in ${settings.dropshiptime} secs!`);
                warned = true;
            }
        }
    }
}), () => settings.dropship && getCurrentArea().includes('Kuudra'), { type: 'renderOverlay', name: moduleName });

registerWhen(register('chat', () => {
    isDropshipApproaching = true;
    dropshipTimer = Date.now();
}).setCriteria("[NPC] Elle: A Dropship is approaching! Take it down before it's too late!"), () => settings.dropship && getCurrentArea().includes('Kuudra'), { type: 'chat', name: moduleName });

registerWhen(register('chat', () => {
    isDropshipApproaching = true;
    dropshipTimer = Date.now();
}).setCriteria("[NPC] Elle: A fleet of Dropships are approaching! Take them down before it's too late!"), () => settings.dropship && getCurrentArea().includes('Kuudra'), { type: 'chat', name: moduleName });

registerWhen(register('chat', () => {
    isDropshipApproaching = false;
    warned = false;
}).setCriteria('The Dropship Bomb hit you for ${dmg} true damage.'), () => settings.dropship && getCurrentArea().includes('Kuudra'), { type: 'chat', name: moduleName });

registerWhen(register('worldUnload', () => {
    isDropshipApproaching = false;
    dropshipTimer = 0;
    warned = false;
}), () => settings.dropship && getCurrentArea().includes('Kuudra'), { type: 'worldUnload', name: moduleName });