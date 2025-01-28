import { CHAT_PREFIX } from '../../data/chat';
import { data, inventoryData } from '../../utils/data';
import { Hud } from '../../utils/hud';
import hud_manager from '../../utils/hud_manager';
import getItemId from '../../utils/item_id';

// TODO
// fix sometimes itemname tag not hidden
// hopefully fix rendering order

const URL = Java.type('java.net.URL');
const ImageIO = Java.type('javax.imageio.ImageIO');
const GuiButton = Java.type('net.minecraft.client.gui.GuiButton');
const GuiCheckBox = Java.type('net.minecraftforge.fml.client.config.GuiCheckBox');

const rememberInvHud = new Hud('reminv', 'Remember Inventory', hud_manager, data);

const itemNameDisplay = new Display();
itemNameDisplay.setBackground(DisplayHandler.Background.FULL).setBackgroundColor(Renderer.color(20, 0, 40));
itemNameDisplay.setRegisterType('post gui render');

let [x, y] = rememberInvHud.getCoords();
const interval = 20;

let textures = [];
let selectableOptions = [];
let checkBoxes = {};
let selectedOption = '';

/**
 * Get skull texture url from item nbt.
 * @param {NBTTagCompound} nbt
 * @returns
 */
const getSkullTextureId = (nbt) => {
  const encoded = nbt.getCompoundTag('tag').getCompoundTag('SkullOwner').getCompoundTag('Properties').toObject()[
    'textures'
  ]['0']['Value'];
  const decoded = FileLib.decodeBase64(encoded);
  const decodedObject = JSON.parse(decoded);
  const url = decodedObject.textures.SKIN.url;
  return url.replace('http://textures.minecraft.net/texture/', '');
};

const getTexture = (textureId) => {
  if (!Object.keys(textures).includes(textureId)) {
    new Thread(() => {
      textures[textureId] = new Image(
        ImageIO.read(new URL(`https://mc-heads.net/head/${textureId}`).openConnection().inputStream),
      );
    }).start();
  }
  return textures[textureId];
};

/**
 * Generate check boxes according to the remembered inventory name.
 * @param {string[]} options
 */
const generateCheckBoxes = (options) => {
  const newCheckBoxes = {};
  [x, y] = rememberInvHud.getCoords();
  options.forEach((option, i) => {
    if (!Object.keys(checkBoxes).includes(option)) {
      newCheckBoxes[option] = [new GuiCheckBox(i, x, y + interval * i, option, false)];
      newCheckBoxes[option].push(
        new GuiButton(
          i + options.length,
          x + newCheckBoxes[option][0].func_146117_b() + 3,
          y + interval * i - 3,
          20,
          20,
          'X',
        ),
      );
    } else {
      newCheckBoxes[option] = checkBoxes[option];
    }
  });
  Object.keys(newCheckBoxes).forEach((cb, i) => {
    newCheckBoxes[cb][0].field_146128_h = x;
    newCheckBoxes[cb][1].field_146128_h = x + newCheckBoxes[cb][0].func_146117_b() + 3;
    newCheckBoxes[cb][0].field_146129_i = y + interval * i;
    newCheckBoxes[cb][1].field_146129_i = y + interval * i - 3;
  });
  checkBoxes = {};
  checkBoxes = newCheckBoxes;
};

register('command', (...args) => {
  if (!args || typeof args === 'undefined') {
    ChatLib.chat(`${CHAT_PREFIX} &c[ERROR] Please specify the name.`);
    return;
  }
  if (!Player.getInventory()) return;
  const inventoryName = args.join(' ');
  let itemIndex = 0;
  let item;
  let inventoryDetails = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 9; j++) {
      itemIndex = i * 9 + j;
      item = Player.getInventory()?.getStackInSlot(itemIndex);
      if (item) {
        inventoryDetails.push({
          index: itemIndex,
          name: item.getName(),
          itemId: getItemId(item),
          id: item.getID(),
          isEnchanted: item.isEnchanted(),
          isSkull: item.getID() === 397,
          textureId: item.getID() === 397 ? getSkullTextureId(item.getNBT()) : '', // https://mc-heads.net/head/${textureId}
        });
      }
    }
  }
  inventoryData[inventoryName] = inventoryDetails;
  inventoryData.save();
})
  .setCommandName('rememberinventory', true)
  .setAliases(['ri']);

register('postGuiRender', (x, y, gui) => {
  if (Java.type('net.minecraft.client.gui.inventory.GuiInventory').class.isInstance(gui)) {
    selectableOptions = Object.keys(inventoryData);
    generateCheckBoxes(selectableOptions);
    Object.keys(checkBoxes).forEach((cb) => {
      checkBoxes[cb][0].func_146112_a(Client.getMinecraft(), x, y);
      checkBoxes[cb][1].func_146112_a(Client.getMinecraft(), x, y);
    });

    // render item name
    if (Object.keys(inventoryData).includes(selectedOption)) {
      const mouseSlot = Client.currentGui.getSlotUnderMouse();
      if (mouseSlot) {
        const item = mouseSlot.getItem();
        const index = mouseSlot.getIndex();
        if (index < 9) return;
        let itemIndex = -1;
        if (index >= 36) {
          itemIndex = index - 36;
        } else {
          itemIndex = index;
        }
        inventoryData[selectedOption].forEach((itemData) => {
          if (itemData.index === itemIndex) {
            if (!item || getItemId(item) !== itemData.itemId) {
              itemNameDisplay.setLine(0, itemData.name);
              itemNameDisplay.setRenderLoc(x, y - 20);
              itemNameDisplay.show();
            }
          }
        });
      } else {
        itemNameDisplay.hide();
      }
    }
  }
});

register('guiClosed', () => {
  itemNameDisplay.hide();
});

register('renderSlot', (slot, gui) => {
  if (
    Java.type('net.minecraft.client.gui.inventory.GuiInventory').class.isInstance(gui) &&
    Object.keys(inventoryData).includes(selectedOption)
  ) {
    if (slot.getIndex() < 9) return;
    const [x, y] = [slot.getDisplayX(), slot.getDisplayY()];
    const item = slot.getItem();
    const index = slot.getIndex();
    let itemIndex = -1;
    if (index >= 36) {
      // hotbar
      itemIndex = index - 36;
    } else {
      itemIndex = index;
    }
    inventoryData[selectedOption].forEach((itemData) => {
      if (itemData.index === itemIndex) {
        if (!item || getItemId(item) !== itemData.itemId) {
          Renderer.drawRect(Renderer.color(200, 50, 50), x, y, 16, 16);
          if (!item) {
            if (itemData.isSkull) {
              const texture = getTexture(itemData.textureId);
              if (texture) texture.draw(x, y, 16, 16);
            } else {
              const correctItem = new Item(itemData.id);
              correctItem.draw(x, y, 1);
            }
          }
        }
      }
    });
  }
});

register('guiMouseClick', () => {
  let checkedIndex = -1;
  Object.keys(checkBoxes).forEach((cb, i) => {
    if (checkBoxes[cb][1].func_146115_a()) {
      selectedOption = '';
      delete inventoryData[cb];
      inventoryData.save();
      return;
    }
    if (checkBoxes[cb][0].func_146115_a()) {
      checkBoxes[cb][0].setIsChecked(!checkBoxes[cb][0].isChecked());
      if (checkBoxes[cb][0].isChecked()) {
        checkedIndex = i;
        selectedOption = cb;
      } else {
        selectedOption = '';
      }
    }
  });
  if (checkedIndex !== -1) {
    Object.keys(checkBoxes).forEach((cb, i) => {
      if (i !== checkedIndex) {
        checkBoxes[cb][0].setIsChecked(false);
      }
    });
  }
});
