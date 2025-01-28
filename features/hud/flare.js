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
  'ewogICJ0aW1lc3RhbXAiIDogMTY2MjY4Mjg0NTU4NiwKICAicHJvZmlsZUlkIiA6ICIwODFiZTAxZmZlMmU0ODMyODI3MDIwMjBlNmI1M2ExNyIsCiAgInByb2ZpbGVOYW1lIiA6ICJMeXJpY1BsYXRlMjUyNDIiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjJlMmJmNmMxZWMzMzAyNDc5MjdiYTYzNDc5ZTU4NzJhYzY2YjA2OTAzYzg2YzgyYjUyZGFjOWYxYzk3MTQ1OCIsCiAgICAgICJtZXRhZGF0YSIgOiB7CiAgICAgICAgIm1vZGVsIiA6ICJzbGltIgogICAgICB9CiAgICB9CiAgfQp9';
// TODO
const alertFlareNBT =
  'ewogICJ0aW1lc3RhbXAiIDogMTY0NjY4NzMyNjQzMiwKICAicHJvZmlsZUlkIiA6ICI0MWQzYWJjMmQ3NDk0MDBjOTA5MGQ1NDM0ZDAzODMxYiIsCiAgInByb2ZpbGVOYW1lIiA6ICJNZWdha2xvb24iLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWQyYmY5ODY0NzIwZDg3ZmQwNmI4NGVmYTgwYjc5NWM0OGVkNTM5YjE2NTIzYzNiMWYxOTkwYjQwYzAwM2Y2YiIKICAgIH0KICB9Cn0';
const sosFlareNBT =
  'ewogICJ0aW1lc3RhbXAiIDogMTY2MjY4Mjc3NjUxNiwKICAicHJvZmlsZUlkIiA6ICI4YjgyM2E1YmU0Njk0YjhiOTE0NmE5MWRhMjk4ZTViNSIsCiAgInByb2ZpbGVOYW1lIiA6ICJTZXBoaXRpcyIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS9jMDA2MmNjOThlYmRhNzJhNmE0Yjg5NzgzYWRjZWYyODE1YjQ4M2EwMWQ3M2VhODdiM2RmNzYwNzJhODlkMTNiIiwKICAgICAgIm1ldGFkYXRhIiA6IHsKICAgICAgICAibW9kZWwiIDogInNsaW0iCiAgICAgIH0KICAgIH0KICB9Cn0=';

registerWhen(
  register('step', () => {
    const armorStands = World.getAllEntitiesOfType(ArmorStand);
    const playerLocation = [Player.getX(), Player.getY(), Player.getZ()];
    flare.type = 0;
    flare.time = 0;
    isFlareActive = false;
    armorStands.forEach((armorStand) => {
      const entityLocation = [armorStand.getX(), armorStand.getY(), armorStand.getZ()];
      const dist = Math.sqrt(
        (entityLocation[0] - playerLocation[0]) ** 2 +
          (entityLocation[1] - playerLocation[1]) ** 2 +
          (entityLocation[2] - playerLocation[2]) ** 2,
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
      let currentFlareTime = Number.parseInt(180 - armorStand.getTicksExisted() / 20);
      if (currentFlareType > flare.type) {
        flare.type = currentFlareType;
        flare.time = currentFlareTime;
      } else if (currentFlareType === flare.type && currentFlareTime > flare.time) {
        flare.time = currentFlareTime;
      }
    });
  }),
  () => settings.flaretimer,
  { type: 'step', name: moduleName },
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
  { type: 'renderOverlay', name: moduleName },
);

register('worldUnload', () => {
  flare = {
    type: 0,
    time: 0,
  };
});
