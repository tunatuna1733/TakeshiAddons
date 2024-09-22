import settings from '../../settings';
import { registerWhen } from '../../utils/register';
import { getCurrentArea } from '../../utils/area';

let lastWarned = 0;

const moduleName = 'Energized Chunk';

registerWhen(
  register('renderWorld', () => {
    if (Player.getY() < 20) {
      World.getAllEntitiesOfType(
        Java.type('net.minecraft.entity.item.EntityArmorStand').class
      ).forEach((armorStand) => {
        const name = ChatLib.removeFormatting(armorStand.getName());
        if (name.includes('ENERGIZED')) {
          const dist = Math.sqrt(
            Math.pow(Player.getX() - armorStand.getX(), 2) +
              Math.pow(Player.getZ() - armorStand.getZ(), 2)
          );
          if (dist < 5 && Date.now() - lastWarned > 0.5 * 1000) {
            World.playSound('note.pling', 4, 1.5);
            Client.showTitle(`&cENERGY CHUNK!!!!`, '', 0, 0.5 * 20, 0);
            lastWarned = Date.now();
          }
        }
      });
    }
  }),
  () => settings.energizedchunk && getCurrentArea().includes('Kuudra'),
  { type: 'renderWorld', name: moduleName }
);

registerWhen(
  register('worldUnload', () => {
    lastWarned = 0;
  }),
  () => settings.energizedchunk && getCurrentArea().includes('Kuudra'),
  { type: 'worldUnload', name: moduleName }
);
