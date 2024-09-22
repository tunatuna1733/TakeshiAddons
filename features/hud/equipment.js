import settings from '../../settings';
import { data } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from '../../utils/item_id';
import { registerWhen } from '../../utils/register';

let guiOpened = false;

const eqHud = new Hud('equipment', 'None\nNone\nNone\nNone', hud_manager, data);

const moduleName = 'Equipment HUD';

registerWhen(
  register('renderOverlay', () => {
    eqHud.draw(
      `${data.equipment.slot1}\n${data.equipment.slot2}\n${data.equipment.slot3}\n${data.equipment.slot4}`
    );
  }),
  () => settings.equipmenthud,
  { type: 'renderOverlay', name: moduleName }
);

const equipmentSlotNums = new Map([
  [1, 10],
  [2, 19],
  [3, 28],
  [4, 37],
]); // { order: slot number }

/**
 * Scans equipment and save them.
 * @param {Inventory} inventory
 * @param {number} slotNum
 */
const saveEquipment = (inventory) => {
  equipmentSlotNums.forEach((slotNum, order) => {
    const item = inventory.getStackInSlot(slotNum);
    if (item === null) data.equipment[`slot${order}`] = 'None';
    else if (item.getName().removeFormatting().includes('Empty')) {
      // Empty Slot
      data.equipment[`slot${order}`] = 'None';
      data.equipment[`id${order}`] = 'UNKNOWN_ITEM';
    } else {
      data.equipment[`slot${order}`] = item.getName();
      data.equipment[`id${order}`] = getItemId(item);
    }
  });
  data.save();
};

register('postGuiRender', () => {
  const inventory = Player.getContainer();
  if (
    !guiOpened &&
    inventory &&
    inventory?.getName().includes('Your Equipment and Stats')
  ) {
    guiOpened = true;
    const guiLoaded = register('tick', () => {
      if (inventory.getStackInSlot(inventory.getSize() - 37) === null) return;
      guiLoaded.unregister();
      saveEquipment(inventory);
      /*
            if (inventory.getStackInSlot(10) === null) data.equipment.slot1 = 'None';
            else {
                data.equipment.slot1 = inventory.getStackInSlot(10).getName();
                if (!inventory.getStackInSlot(10).getName().includes('Empty')) {
                    try {
                        data.equipment.id1 = getItemId(inventory.getStackInSlot(10));
                    } catch (e) {
                        data.equipment.id1 = 'NONE';
                    }
                } else {
                    data.equipment.id1 = 'NONE';
                }
            }
            if (inventory.getStackInSlot(19) === null) data.equipment.slot2 = 'None';
            else {
                data.equipment.slot2 = inventory.getStackInSlot(19).getName();
                if (!inventory.getStackInSlot(19).getName().includes('Empty')) {
                    try {
                        data.equipment.id2 = getItemId(inventory.getStackInSlot(19));
                    } catch (e) {
                        data.equipment.id2 = 'NONE';
                    }
                } else {
                    data.equipment.id2 = 'NONE';
                }
            }
            if (inventory.getStackInSlot(28) === null) data.equipment.slot3 = 'None';
            else {
                data.equipment.slot3 = inventory.getStackInSlot(28).getName();
                if (!inventory.getStackInSlot(28).getName().includes('Empty')) {
                    try {
                        data.equipment.id3 = getItemId(inventory.getStackInSlot(28));
                    } catch (e) {
                        data.equipment.id3 = 'NONE';
                    }
                } else {
                    data.equipment.id3 = 'NONE';
                }
            }
            if (inventory.getStackInSlot(37) === null) data.equipment.slot4 = 'None';
            else {
                data.equipment.slot4 = inventory.getStackInSlot(37).getName();
                if (!inventory.getStackInSlot(37).getName().includes('Empty')) {
                    try {
                        data.equipment.id4 = getItemId(inventory.getStackInSlot(37));
                    } catch (e) {
                        data.equipment.id4 = 'NONE';
                    }
                } else {
                    data.equipment.id4 = 'NONE';
                }
            }
            data.save();
            */
    });
  }
});

register('guiClosed', () => {
  guiOpened = false;
});
