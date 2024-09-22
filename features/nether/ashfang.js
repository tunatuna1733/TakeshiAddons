import RenderLib from '../../../RenderLib';
import renderBeaconBeam from '../../../BeaconBeam';
import settings from '../../settings';
import { getCurrentArea, getCurrentZone } from '../../utils/area';
import { registerWhen } from '../../utils/register';

const EntityArmorStand = Java.type(
  'net.minecraft.entity.item.EntityArmorStand'
);
const encodedBlackholeTexture =
  'eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWE2OWNjZjdhZDkwNGM5YTg1MmVhMmZmM2Y1YjRlMjNhZGViZjcyZWQxMmQ1ZjI0Yjc4Y2UyZDQ0YjRhMiJ9fX0=';

registerWhen(
  register('renderWorld', () => {
    if (getCurrentZone() !== 'Ruins of Ashfang') return;
    World.getAllEntitiesOfType(EntityArmorStand.class).forEach((armorStand) => {
      // ashfang
      if (armorStand.getName().removeFormatting().includes('[Lv200] Ashfang')) {
        RenderLib.drawEspBox(
          armorStand.getX(),
          armorStand.getY() - 3,
          armorStand.getZ(),
          1,
          3,
          settings.ashfangcolor.getRed() / 255,
          settings.ashfangcolor.getGreen() / 255,
          settings.ashfangcolor.getBlue() / 255,
          settings.ashfangcolor.getAlpha() / 255,
          true
        );
      }
      // blue blazes
      else if (
        armorStand
          .getName()
          .removeFormatting()
          .includes('[Lv150] Ashfang Acolyte')
      ) {
        RenderLib.drawEspBox(
          armorStand.getX(),
          armorStand.getY() - 2,
          armorStand.getZ(),
          1,
          2,
          0.2,
          0.2,
          1,
          1,
          true
        );
      }
      // red blazes
      else if (
        armorStand
          .getName()
          .removeFormatting()
          .includes('[Lv150] Ashfang Underling')
      ) {
        RenderLib.drawEspBox(
          armorStand.getX(),
          armorStand.getY() - 2,
          armorStand.getZ(),
          1,
          2,
          1,
          0.2,
          0.2,
          1,
          true
        );
      }
      // blackhole
      else {
        const entity = new EntityLivingBase(armorStand.getEntity());
        const headNBT = entity.getItemInSlot(4)?.getRawNBT();
        if (!headNBT) return;
        if (headNBT.includes(encodedBlackholeTexture)) {
          renderBeaconBeam(
            entity.getX() - 0.5,
            entity.getY() - 1,
            entity.getZ() - 0.5,
            settings.ashfangbhcolor.getRed() / 255,
            settings.ashfangbhcolor.getGreen() / 255,
            settings.ashfangbhcolor.getBlue() / 255,
            settings.ashfangbhcolor.getAlpha() / 255,
            false,
            100
          );
        }
      }
    });
  }),
  () => getCurrentArea() === 'Crimson Isle' && settings.ashfanghelper,
  { type: 'renderWorld', name: 'Ashfang Helper' }
);
