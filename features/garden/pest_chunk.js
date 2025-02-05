import settings from '../../settings';
import { getCurrentArea } from '../../utils/area';
import { data, gardenData } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from '../../utils/item_id';
import { registerWhen } from '../../utils/register';
const GuiButton = Java.type('net.minecraft.client.gui.GuiButton');

let guiOpen = false;
let pestList = [];
const baseX = -240;
const baseY = -240;
const plotSize = 96;
const bottomY = 68;
const topY = 100;
let buttons = [];
// let scoreChecked = false;
// let lastPestAddTime = 0;
// let pestCount = 0;
let plotButtons = [];
let lastCommand = 0;

const pestHud = new Hud('pests', 'Pest Display', hud_manager, data);

const plotNumberTable = [
  [21, 13, 9, 14, 22],
  [15, 5, 1, 6, 16],
  [10, 2, 0, 3, 11],
  [17, 7, 4, 8, 18],
  [23, 19, 12, 20, 24],
];

const convertPlotNumber = (rawPlotNum) => {
  let x = 0;
  let y = 0;
  plotNumberTable.forEach((plots, i) => {
    plots.forEach((p, j) => {
      if (p === rawPlotNum) {
        x = j;
        y = i;
      }
    });
  });
  return [x, y];
};

const getPlotName = (x, y) => {
  let plotName = '';
  gardenData.plotData.forEach((p) => {
    if (p.x === x && p.y === y) plotName = p.name;
  });
  return plotName;
};

const generateButtons = (plots) => {
  buttons = [];
  plots.forEach((p, i) => {
    const button = new GuiButton(i, 10, 10, 20, 20, 'TP');
    button.field_146125_m = false;
    buttons.push({
      name: p.name,
      button: button,
    });
  });
};

register('gameLoad', () => {
  generateButtons(gardenData.plotData);
});

/*
we no longer need to track chat messages ig
register('chat', (a, num, name) => {
    const amount = parseInt(num);
    let found = false;
    pestList.forEach((p) => {
        if (p.name === name) {
            p.amount += amount;
            found = true;
        }
    });
    if (!found) {
        pestList.push({
            name: name,
            amount: amount
        });
    }
    lastPestAddTime = Date.now();
}).setChatCriteria('${a}! ${num} Pests have spawned in Plot - ${name}!').setContains();

register('chat', (a, name) => {
    let found = false;
    pestList.forEach((p) => {
        if (p.name === name) {
            p.amount += 1;
            found = true;
        }
    });
    if (!found) {
        pestList.push({
            name: name,
            amount: 1
        });
    }
    lastPestAddTime = Date.now();
}).setChatCriteria('${a}! A Pest has appeared in Plot - ${name}!').setContains();
*/

registerWhen(
  register('step', () => {
    try {
      if (!World.isLoaded() || !TabList) return;
      const tabNames = TabList.getNames();
      if (!tabNames) return;
      tabNames.forEach((name) => {
        // TODO: get plot numbers and convert them to push to pest list
        if (name.removeFormatting().includes('Plots:')) {
          pestList = [];
          const plotNums = name
            .removeFormatting()
            .replace(' ', '')
            .replace('Plots:', '')
            .split(',')
            .map((p) => Number.parseInt(p));
          plotNums.forEach((rawPlotNum) => {
            const [x, y] = convertPlotNumber(rawPlotNum);
            const plotName = getPlotName(x, y);
            pestList.push({
              name: plotName,
              amount: 1,
            });
          });
        }
        if (name.removeFormatting().includes('Alive: 0')) {
          pestList = [];
        }
      });
    } catch (e) {
      // might be nullptr exception
    }
  }).setDelay(1),
  () => getCurrentArea() === 'Garden',
  { type: 'step', name: 'Pest Update' },
);

// scan plot gui
register('postGuiRender', () => {
  const inventory = Player.getContainer();
  if (!guiOpen && inventory && inventory.getName() === 'Configure Plots') {
    guiOpen = true;
    const guiLoaded = register('tick', () => {
      if (inventory.getStackInSlot(inventory.getSize() - 37) == null) return;
      guiLoaded.unregister();
      let currentSlot = 0;
      let plotItem;
      let plotName;
      let plots = [];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          currentSlot = i * 9 + j + 2;
          plotItem = inventory.getStackInSlot(currentSlot);
          plotName = plotItem.getName().removeFormatting();
          if (plotName /* && plotName !== 'The Barn'*/) {
            plotName = plotName.replace('Plot - ', '');
            plots.push({
              name: plotName,
              x: j,
              y: i,
              id: plotItem.getID(),
            });
          }
        }
      }
      gardenData.plotData = plots;
      gardenData.save();
      generateButtons(plots);
    });
  }
});

/*
register('step', () => {
    if (Date.now() - lastPestAddTime > 1000) {
        if ((getCurrentZone().includes('The Garden') && !getCurrentZone().includes('x')) || getCurrentZone().includes('Plot - ')) {
            if (!scoreChecked) {
                scoreChecked = true;
            } else {
                pestList = [];
            }
        } else {
            scoreChecked = false;
        }
    }
}).setDelay(1);
*/

// Tesselator things
registerWhen(
  register('renderWorld', () => {
    const heldItem = Player.getHeldItem();
    if (!heldItem) return;
    const heldItemId = getItemId(heldItem);
    if (!heldItemId.includes('_VACUUM')) return;
    pestList.forEach((p) => {
      const ix = gardenData.plotData.find((d) => d.name === p.name).x;
      const iy = gardenData.plotData.find((d) => d.name === p.name).y;
      const px = baseX + plotSize * ix;
      const py = baseY + plotSize * iy;

      GL11.glBlendFunc(770, 771);
      GL11.glEnable(GL11.GL_BLEND);
      GL11.glLineWidth(3);
      GL11.glDisable(GL11.GL_TEXTURE_2D);
      GL11.glDisable(GL11.GL_DEPTH_TEST);
      GL11.glDepthMask(false);
      GlStateManager.func_179094_E();

      // render 4 vertices
      Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
      Tessellator.pos(px, bottomY, py).tex(0, 0);
      Tessellator.pos(px, topY, py).tex(0, 0);
      Tessellator.draw();

      Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
      Tessellator.pos(px + plotSize, bottomY, py).tex(0, 0);
      Tessellator.pos(px + plotSize, topY, py).tex(0, 0);
      Tessellator.draw();

      Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
      Tessellator.pos(px, bottomY, py + plotSize).tex(0, 0);
      Tessellator.pos(px, topY, py + plotSize).tex(0, 0);
      Tessellator.draw();

      Tessellator.begin(3).colorize(0.1, 0.1, 0.9, 1.0);
      Tessellator.pos(px + plotSize, bottomY, py + plotSize).tex(0, 0);
      Tessellator.pos(px + plotSize, topY, py + plotSize).tex(0, 0);
      Tessellator.draw();

      // render vertical lines
      // X-axis
      for (let i = 1; i < plotSize / 8; i++) {
        Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
        Tessellator.pos(px + 8 * i, bottomY, py);
        Tessellator.pos(px + 8 * i, topY, py);
        Tessellator.draw();

        Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
        Tessellator.pos(px + 8 * i, bottomY, py + plotSize);
        Tessellator.pos(px + 8 * i, topY, py + plotSize);
        Tessellator.draw();
      }

      // Z-axis
      for (let i = 1; i < plotSize / 8; i++) {
        Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
        Tessellator.pos(px, bottomY, py + 8 * i);
        Tessellator.pos(px, topY, py + 8 * i);
        Tessellator.draw();

        Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
        Tessellator.pos(px + plotSize, bottomY, py + 8 * i);
        Tessellator.pos(px + plotSize, topY, py + 8 * i);
        Tessellator.draw();
      }

      // render horizontal lines
      let currentY = bottomY;
      for (let i = 0; i < (topY - bottomY) / 8; i++) {
        Tessellator.begin(3).colorize(0.9, 0.9, 0.1, 1.0);
        Tessellator.pos(px, currentY, py);
        Tessellator.pos(px + plotSize, currentY, py);
        Tessellator.pos(px + plotSize, currentY, py + plotSize);
        Tessellator.pos(px, currentY, py + plotSize);
        Tessellator.pos(px, currentY, py);
        Tessellator.draw();
        currentY += 8;
      }

      GlStateManager.func_179121_F();
      GL11.glEnable(GL11.GL_TEXTURE_2D);
      GL11.glEnable(GL11.GL_DEPTH_TEST);
      GL11.glDepthMask(true);
      GL11.glDisable(GL11.GL_BLEND);
    });
  }),
  () => settings.pestarea && getCurrentArea() === 'Garden',
  { type: 'renderWorld', name: 'Pest Area' },
);

registerWhen(
  register('renderOverlay', () => {
    /* we no longer need to scan kills
    if (getCurrentZone().includes('The Garden') && getCurrentZone().includes('x')) {
        const amount = parseInt(getCurrentZone().match(/\d/g)[0]);
        if (amount < pestCount) {
            // pest kill occured
            const [x, z] = [Player.getX(), Player.getZ()];
            let minName = '', minDist = 100000;
            pestList.forEach((pest) => {
                gardenData.plotData.forEach((plot) => {
                    if (plot.name === pest.name) {
                        const dist = Math.sqrt(Math.pow(x - (baseX + plot.x * plotSize + plotSize / 2), 2) + Math.pow(z - (baseY + plot.y * plotSize + plotSize / 2), 2));
                        if (dist < minDist) {
                            minName = plot.name;
                            minDist = dist;
                        }
                    }
                });
            });
            let removeElem = false;
            pestList.forEach((pest) => {
                if (pest.name === minName) {
                    if (pest.amount === 1) {
                        removeElem = true;
                    } else {
                        pest.amount -= 1;
                    }
                }
            });
            if (removeElem) {
                pestList = pestList.filter((p) => p.name !== minName);
            }
        }
        pestCount = amount;
    }
    */

    let lines = '&aPests';
    pestList.forEach((p) => {
      lines += `\n &6${p.name}: &c${p.amount}`;
    });
    if (pestList.length !== 0) pestHud.draw(lines);
  }),
  () => settings.pestarea && getCurrentArea() === 'Garden',
  { type: 'renderOverlay', name: 'Pest Area' },
);

registerWhen(
  register('guiRender', (mx, my, gui) => {
    if (Java.type('net.minecraft.client.gui.inventory.GuiInventory').class.isInstance(gui)) {
      const [x, y] = pestHud.getCoords();
      const scale = 1.5;
      GlStateManager.func_179094_E();
      gardenData.plotData.forEach((plot, i) => {
        const item = new Item(plot.id || 3);
        // ink sack -> cocoa bean
        if (item.getID() === 351) {
          item.setDamage(3);
        }
        const ix = i % 5;
        const iy = (i - ix) / 5;
        const absx = x + ix * 16 * scale;
        const absy = y + iy * 16 * scale;
        plotButtons.push({
          absx: absx,
          absy: absy,
          name: plot.name,
        });
        Renderer.translate(absx, absy, 500);
        item.draw(0, 0, scale);
        Renderer.translate(0, 0, 0);
        GlStateManager.func_179097_i();
        pestList.forEach((pest) => {
          if (pest.name === plot.name) {
            Renderer.translate(absx + 8, absy + 8, 600);
            Renderer.scale(2);
            Renderer.drawString(`&e${pest.amount}`, 0, 0, true);
            Renderer.translate(0, 0, 0);
            Renderer.scale(1);
          }
        });
        if (absx < mx && mx < absx + 16 * scale && absy < my && my < absy + 16 * scale) {
          Renderer.translate(absx, absy, 700);
          Renderer.drawRect(Renderer.color(210, 210, 210, 150), 0, 0, 16 * scale, 16 * scale);
          Renderer.translate(0, 0, 0);
        }
        GlStateManager.func_179126_j();
      });
      GlStateManager.func_179121_F();
    }
  }),
  () => settings.pestmap && getCurrentArea() === 'Garden',
  { type: 'guiRender', name: 'Pest Map' },
);

registerWhen(
  register('postGuiRender', (mx, my, gui) => {
    if (Java.type('net.minecraft.client.gui.GuiChat').class.isInstance(gui)) {
      let lines = '&aPests';
      const interval = 16 * pestHud.getScale();
      const [x, y] = pestHud.getCoords();
      pestList.forEach((p, i) => {
        const detail = ` &6${p.name}: &c${p.amount}`;
        const width = Renderer.getStringWidth(detail);
        lines += `\n${detail}`;
        buttons.forEach((b) => {
          if (b.name === p.name) {
            b.button.field_146128_h = x + width * pestHud.getScale() + 3;
            b.button.field_146129_i = y + 16 * (i + 1);
            b.button.field_146125_m = true;
            b.button.func_146112_a(Client.getMinecraft(), mx, my);
          }
        });
      });
      if (pestList.length !== 0) pestHud.draw(lines);
    }
  }),
  () => settings.pestarea && getCurrentArea() === 'Garden',
  { type: 'postGuiRender', name: 'Pest Area' },
);

registerWhen(
  register('guiMouseClick', (mx, my, mb, gui) => {
    if (Java.type('net.minecraft.client.gui.GuiChat').class.isInstance(gui)) {
      buttons.forEach((b) => {
        if (b.button.func_146115_a() && b.button.field_146125_m) {
          const command = `plottp ${b.name}`;
          ChatLib.command(command);
        }
      });
    }
  }),
  () => settings.pestarea && getCurrentArea() === 'Garden',
  { type: 'guiMouseClick', name: 'Pest Area' },
);

registerWhen(
  register('guiMouseClick', (mx, my, mb, gui) => {
    if (Java.type('net.minecraft.client.gui.inventory.GuiInventory').class.isInstance(gui)) {
      const scale = 1.5;
      plotButtons.forEach((pb) => {
        if (pb.absx < mx && mx < pb.absx + 16 * scale && pb.absy < my && my < pb.absy + 16 * scale) {
          if (Date.now() - lastCommand > 1000) {
            if (pb.name === 'The Barn') {
              ChatLib.command('plottp barn');
            } else {
              ChatLib.command(`plottp ${pb.name}`);
            }
            lastCommand = Date.now();
          }
        }
      });
    }
  }),
  () => settings.pestmap && getCurrentArea() === 'Garden',
  { type: 'guiMouseClick', name: 'Pest Map' },
);

registerWhen(
  register('guiClosed', (gui) => {
    guiOpen = false;
    if (Java.type('net.minecraft.client.gui.GuiChat').class.isInstance(gui)) {
      buttons.forEach((b) => {
        b.button.field_146125_m = false;
      });
    }
  }),
  () => settings.pestarea && getCurrentArea() === 'Garden',
  { type: 'guiClosed', name: 'Pest Area' },
);

register('command', () => {
  pestList.forEach((p) => {
    ChatLib.chat(`${p.name}: ${p.amount}`);
  });
}).setCommandName('debugprintpests');
