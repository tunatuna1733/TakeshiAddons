import RenderLib from '../../../RenderLib';
import settings from '../../settings';
import { getCurrentArea } from '../../utils/area';
import { registerWhen } from '../../utils/register';

const TileEntityChest = Java.type('net.minecraft.tileentity.TileEntityChest');

let chests = [];

registerWhen(
  register('step', () => {
    chests = [];
    World.getAllTileEntitiesOfType(TileEntityChest.class).forEach((chest) => {
      if (chest.tileEntity.field_145989_m === 0)
        // lidAngle
        chests.push(chest);
    });
  }).setFps(2),
  () => settings.powderchesthighlight && getCurrentArea() === 'Crystal Hollows',
  { type: 'step', name: 'Powder Chest Highlight' }
);

registerWhen(
  register('renderWorld', () => {
    chests.forEach((chest) => {
      RenderLib.drawEspBox(
        chest.getX() + 0.5,
        chest.getY(),
        chest.getZ() + 0.5,
        1,
        1,
        settings.powderchesthighlightcolor.getRed() / 255,
        settings.powderchesthighlightcolor.getGreen() / 255,
        settings.powderchesthighlightcolor.getBlue() / 255,
        settings.powderchesthighlightcolor.getAlpha() / 255,
        true
      );
    });
  }),
  () => settings.powderchesthighlight && getCurrentArea() === 'Crystal Hollows',
  { type: 'renderWorld', name: 'Powder Chest Highlight' }
);
