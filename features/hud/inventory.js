import settings from '../../settings';
import { data } from '../../utils/data';
import hud_manager from '../../utils/hud_manager';
import { isInSkyblock } from '../../utils/hypixel';
import { InventoryHud } from '../../utils/inventory_hud';
import { registerWhen } from '../../utils/register';

const inventoryHud = new InventoryHud('inventory', hud_manager, data);

const moduleName = 'Inventory HUD';

let inventoryRects = [];

register('gameLoad', () => {
  inventoryRects = [];
  for (let i = 0; i < 27; i++) {
    inventoryRects.push(new Rectangle(0, 0, 0, 1, 1));
  }
});

// Credit: ct module InventoryHUD
let item;
registerWhen(
  register('renderOverlay', () => {
    if (!Player.getInventory() || !isInSkyblock()) return;
    if (inventoryRects.length !== 27) {
      inventoryRects = [];
      for (let i = 0; i < 27; i++) {
        inventoryRects.push(new Rectangle(0, 0, 0, 1, 1));
      }
    }
    GlStateManager.func_179094_E();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 9; j++) {
        const [x, y] = inventoryHud.getCoords();
        const scale = inventoryHud.getScale();
        inventoryRects[i * 9 + j]
          .setX(x + (1 + 33 * j) * scale)
          .setY(y + (1 + 33 * i) * scale)
          .setWidth(32 * scale)
          .setHeight(32 * scale)
          .setOutline(settings.inventorycolor.getRGB(), 1)
          .draw();
        item = Player.getInventory().getStackInSlot(9 + i * 9 + j);
        if (item && item.getID() !== -1) {
          item.draw(
            x + (1 + 33 * j) * scale,
            y + (1 + 33 * i) * scale,
            scale * 2
          );
          GlStateManager.func_179097_i();
          if (item.getItemStack().func_77985_e() && item.getStackSize() !== 1) {
            if (item.getStackSize().toString().length > 1)
              Renderer.drawStringWithShadow(
                item.getStackSize(),
                x + (1 + 33 * j + 15) * scale,
                y + (1 + 33 * i + 15) * scale
              );
            else
              Renderer.drawStringWithShadow(
                item.getStackSize(),
                x + (1 + 33 * j + 20) * scale,
                y + (1 + 33 * i + 15) * scale
              );
          }
          GlStateManager.func_179126_j();
        }
      }
    }
    GlStateManager.func_179121_F();
  }),
  () => settings.inventory,
  { type: 'renderOverlay', name: moduleName }
);
