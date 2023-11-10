import settings from "../../settings";
import { data } from "../../utils/data";
import { registerWhen } from "../../utils/register";

let guiOpened = false;

const getEquipmentHUDRenderCoords = () => {
    const x = data.equipment.x;
    const y = data.equipment.y;
    return [x, y];
}

const setEquipmentHUDRenderCoords = (x, y) => {
    data.equipment.x = x;
    data.equipment.y = y;
    data.save();
    return;
}

registerWhen(register('renderOverlay', () => {
    const x = data.equipment.x;
    const y1 = data.equipment.y;
    const y2 = parseInt(y1) + 10;
    const y3 = parseInt(y1) + 20;
    const y4 = parseInt(y1) + 30;
    Renderer.drawStringWithShadow(data.equipment.slot1, x, y1);
    Renderer.drawStringWithShadow(data.equipment.slot2, x, y2);
    Renderer.drawStringWithShadow(data.equipment.slot3, x, y3);
    Renderer.drawStringWithShadow(data.equipment.slot4, x, y4);
}), () => settings.equipmenthud);

register('postGuiRender', () => {
    const inventory = Player.getContainer();
    if (!guiOpened && inventory && inventory?.getName().includes('Your Equipment and Stats')) {
        guiOpened = true;
        const guiLoaded = register('tick', () => {
            if (inventory.getStackInSlot(inventory.getSize() - 37) === null) return;
            guiLoaded.unregister();
            if (inventory.getStackInSlot(10) === null) data.equipment.slot1 = 'None';
            else {
                data.equipment.slot1 = inventory.getStackInSlot(10).getName();
                if (!inventory.getStackInSlot(10).getName().includes('Empty')) {
                    try {
                        data.equipment.id1 = inventory.getStackInSlot(10).getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
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
                        data.equipment.id2 = inventory.getStackInSlot(19).getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
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
                        data.equipment.id3 = inventory.getStackInSlot(28).getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
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
                        data.equipment.id4 = inventory.getStackInSlot(37).getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
                    } catch (e) {
                        data.equipment.id4 = 'NONE';
                    }
                } else {
                    data.equipment.id4 = 'NONE';
                }
            }
            data.save();
        });
    }
});

register('guiClosed', () => {
    guiOpened = false;
});

export const equipment_hud_move_gui = new Gui();
const gui_string = 'Drag to move Equipment HUD';
const gui_text_component = new Text(gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

equipment_hud_move_gui.registerDraw(() => {
    gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!equipment_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getEquipmentHUDRenderCoords();
    setEquipmentHUDRenderCoords(current_x + dx, current_y + dy);
});