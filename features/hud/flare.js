import settings from '../../settings';
import { data } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import { registerWhen } from '../../utils/register';

const flareHud = new Hud('flare', '&aWarning 0s', hud_manager, data);

const moduleName = 'Flare HUD';

// Credit: ct module GriffinOwO
const ArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');
let flare = {
  type: 0, // 0: none, 1: warning, 2: alert, 3: sos
  time: 0,
};
let isFlareActive = false;

const warningFlareNBT =
  'ewogICJ0aW1lc3RhbXAiIDogMTY0NjY4NzMwNjIyMywKICAicHJvZmlsZUlkIiA6ICI0MWQzYWJjMmQ3NDk0MDBjOTA5MGQ1NDM0ZDAzODMxYiIsCiAgInByb2ZpbGVOYW1lIiA6ICJNZWdha2xvb24iLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjJlMmJmNmMxZWMzMzAyNDc5MjdiYTYzNDc5ZTU4NzJhYzY2YjA2OTAzYzg2YzgyYjUyZGFjOWYxYzk3MTQ1OCIKICAgIH0KICB9Cn0';
const alertFlareNBT =
  'ewogICJ0aW1lc3RhbXAiIDogMTY0NjY4NzMyNjQzMiwKICAicHJvZmlsZUlkIiA6ICI0MWQzYWJjMmQ3NDk0MDBjOTA5MGQ1NDM0ZDAzODMxYiIsCiAgInByb2ZpbGVOYW1lIiA6ICJNZWdha2xvb24iLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWQyYmY5ODY0NzIwZDg3ZmQwNmI4NGVmYTgwYjc5NWM0OGVkNTM5YjE2NTIzYzNiMWYxOTkwYjQwYzAwM2Y2YiIKICAgIH0KICB9Cn0';
const sosFlareNBT =
  'ewogICJ0aW1lc3RhbXAiIDogMTY0NjY4NzM0NzQ4OSwKICAicHJvZmlsZUlkIiA6ICI0MWQzYWJjMmQ3NDk0MDBjOTA5MGQ1NDM0ZDAzODMxYiIsCiAgInByb2ZpbGVOYW1lIiA6ICJNZWdha2xvb24iLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzAwNjJjYzk4ZWJkYTcyYTZhNGI4OTc4M2FkY2VmMjgxNWI0ODNhMDFkNzNlYTg3YjNkZjc2MDcyYTg5ZDEzYiIKICAgIH0KICB9Cn0';

registerWhen(
  register('step', () => {
    const armorStands = World.getAllEntitiesOfType(ArmorStand);
    const playerLocation = [Player.getX(), Player.getY(), Player.getZ()];
    flare.type = 0;
    flare.time = 0;
    isFlareActive = false;
    armorStands.forEach((armorStand) => {
      const entityLocation = [
        armorStand.getX(),
        armorStand.getY(),
        armorStand.getZ(),
      ];
      const dist = Math.sqrt(
        Math.pow(entityLocation[0] - playerLocation[0], 2) +
          Math.pow(entityLocation[1] - playerLocation[1], 2) +
          Math.pow(entityLocation[2] - playerLocation[2], 2)
      );
      if (dist > 40 || armorStand.getTicksExisted() > 20 * 60 * 3) return;
      const entity = new EntityLivingBase(armorStand.getEntity());
      const headNBT = entity.getItemInSlot(4)?.getRawNBT();
      if (!headNBT) return;
      let currentFlareType = 0;
      if (headNBT.includes(warningFlareNBT)) currentFlareType = 1;
      else if (headNBT.includes(alertFlareNBT)) currentFlareType = 2;
      else if (headNBT.includes(sosFlareNBT)) currentFlareType = 3;
      else return;
      isFlareActive = true;
      let currentFlareTime = parseInt(180 - armorStand.getTicksExisted() / 20);
      if (currentFlareType > flare.type) {
        flare.type = currentFlareType;
        flare.time = currentFlareTime;
      } else if (
        currentFlareType === flare.type &&
        currentFlareTime > flare.time
      ) {
        flare.time = currentFlareTime;
      }
    });
  }),
  () => settings.flaretimer,
  { type: 'step', name: moduleName }
);

registerWhen(
  register('renderOverlay', () => {
    if (isFlareActive) {
      if (flare.type === 1) {
        // warning
        flareHud.draw(`&aWarning&f: &6${flare.time}`);
      } else if (flare.type === 2) {
        // alert
        flareHud.draw(`&9Alert&f: &6${flare.time}`);
      } else if (flare.type === 3) {
        // sos
        flareHud.draw(`&5SOS&f: &6${flare.time}`);
      }
    }
  }),
  () => settings.flaretimer,
  { type: 'renderOverlay', name: moduleName }
);

register('worldUnload', () => {
  flare = {
    type: 0,
    time: 0,
  };
});
