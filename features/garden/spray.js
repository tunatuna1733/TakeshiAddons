import numeral from 'numeraljs';
import settings from '../../settings';
import { getCurrentArea, getCurrentZone } from '../../utils/area';
import { data, gardenData } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from '../../utils/item_id';
import { registerWhen } from '../../utils/register';

const sprayHud = new Hud('spray', '&6Spray: &a30m', hud_manager, data);

let warned = false;
let shouldWarn = false;

const baseX = -240;
const baseY = -240;
const plotSize = 96;
const bottomY = 68;
const topY = 100;

registerWhen(
  register('renderOverlay', () => {
    const remainingTime = (30 * 60 * 1000 - (Date.now() - gardenData.sprayTime)) / 1000;
    if (remainingTime > 0) {
      const formattedTime = numeral(remainingTime).format('00:00:00').replace('0:', '');
      sprayHud.draw(`&6Spray: &a${formattedTime}`);
      shouldWarn = false;
    } else {
      sprayHud.draw('&6Spray: &cExpired');
      shouldWarn = true;
      if (
        !warned &&
        getCurrentArea() === 'Garden' &&
        (getCurrentZone().includes('Plot - ') || getCurrentZone().includes('The Garden'))
      ) {
        warned = true;
        World.playSound('note.pling', 4, 1.5);
        Client.showTitle('&cSpray Expired!', '', 0, 3 * 20, 0);
        Client.showTitle('&cSpray Expired!', '', 0, 3 * 20, 0);
      }
    }
  }),
  () => settings.spraytimer && getCurrentArea() === 'Garden',
  { type: 'renderOverlay', name: 'Spray Timer' },
);

registerWhen(
  register('step', () => {
    if (settings.sprayalwayswarn && shouldWarn) {
      Client.showTitle('&cSpray Expired!', '', 0, 1, 0);
      Client.showTitle('&cSpray Expired!', '', 0, 6 * 20, 0);
    }
  }).setDelay(5),
  () => settings.spraytimer && getCurrentArea() === 'Garden',
  { type: 'step', name: 'Spray Timer' },
);

registerWhen(
  register('chat', () => {
    gardenData.sprayTime = Date.now();
    gardenData.save();
    warned = false;
  }).setChatCriteria('SPRAYONATOR! This will expire in 30m!'),
  () => settings.spraytimer && getCurrentArea() === 'Garden',
  { type: 'chat', name: 'Spray Timer' },
);

registerWhen(
  register('renderWorld', () => {
    const heldItem = Player.getHeldItem();
    if (!heldItem) return;
    const heldItemId = getItemId(heldItem);
    if (heldItemId !== 'SPRAYONATOR') return;
    const currentX = Player.getX();
    const currentZ = Player.getZ();
    const ix = Math.trunc((currentX - baseX) / plotSize);
    const iz = Math.trunc((currentZ - baseY) / plotSize);
    const px = baseX + plotSize * ix;
    const pz = baseY + plotSize * iz;

    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(3);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(false);
    GlStateManager.func_179094_E();

    // render 4 vertices
    Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
    Tessellator.pos(px, bottomY, pz).tex(0, 0);
    Tessellator.pos(px, topY, pz).tex(0, 0);
    Tessellator.draw();

    Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
    Tessellator.pos(px + plotSize, bottomY, pz).tex(0, 0);
    Tessellator.pos(px + plotSize, topY, pz).tex(0, 0);
    Tessellator.draw();

    Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
    Tessellator.pos(px, bottomY, pz + plotSize).tex(0, 0);
    Tessellator.pos(px, topY, pz + plotSize).tex(0, 0);
    Tessellator.draw();

    Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
    Tessellator.pos(px + plotSize, bottomY, pz + plotSize).tex(0, 0);
    Tessellator.pos(px + plotSize, topY, pz + plotSize).tex(0, 0);
    Tessellator.draw();

    // render vertical lines
    // X-axis
    for (let i = 1; i < plotSize / 8; i++) {
      Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
      Tessellator.pos(px + 8 * i, bottomY, pz);
      Tessellator.pos(px + 8 * i, topY, pz);
      Tessellator.draw();

      Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
      Tessellator.pos(px + 8 * i, bottomY, pz + plotSize);
      Tessellator.pos(px + 8 * i, topY, pz + plotSize);
      Tessellator.draw();
    }

    // Z-axis
    for (let i = 1; i < plotSize / 8; i++) {
      Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
      Tessellator.pos(px, bottomY, pz + 8 * i);
      Tessellator.pos(px, topY, pz + 8 * i);
      Tessellator.draw();

      Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
      Tessellator.pos(px + plotSize, bottomY, pz + 8 * i);
      Tessellator.pos(px + plotSize, topY, pz + 8 * i);
      Tessellator.draw();
    }

    // render horizontal lines
    let currentY = bottomY;
    for (let i = 0; i < (topY - bottomY) / 8; i++) {
      Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
      Tessellator.pos(px, currentY, pz);
      Tessellator.pos(px + plotSize, currentY, pz);
      Tessellator.pos(px + plotSize, currentY, pz + plotSize);
      Tessellator.pos(px, currentY, pz + plotSize);
      Tessellator.pos(px, currentY, pz);
      Tessellator.draw();
      currentY += 8;
    }

    GlStateManager.func_179121_F();
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
  }),
  () => settings.sprayarea && getCurrentArea() === 'Garden',
  { type: 'renderWorld', name: 'Spray Area' },
);
