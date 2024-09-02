import RenderLib from "../../../RenderLib";
import settings from "../../settings";
import { registerWhen } from "../../utils/register";

const starMobRegex = /^§6✯ (?:§.)*(.+)§r.+§c❤$|^(Shadow Assassin)$/;

registerWhen(register('renderWorld', () => {
  World.getAllEntities().forEach(e => {
    const match = e.getName().match(starMobRegex);
    if (!match) return;
    RenderLib.drawEspBox(e.getX(), e.getY() - 2, e.getZ(), 1, 2, 1, 0, 0, 1, true);
  });
}), () => settings.starmob, { type: 'renderWorld', name: 'Star Mob Box' });