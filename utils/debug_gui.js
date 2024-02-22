import Font from "../../FontLib";
import settings from "../settings";
import { BooleanProperty, ColorProperty, SelectorProperty, SliderProperty, StringProperty } from "./config/property";

const Color = Java.type('java.awt.Color');

const gui = new Gui();
let opacity = 0;
let configs = [];
let categoryTexts = [];
export const font = new Font('TakeshiAddons/utils/config/NotoSans-Regular.ttf', 16);

const getPropertyType = (propertyData) => {
    return propertyData.attributesExt.type.toString();
}

const loadConfig = (settings) => {
    const categories = settings.getConfig().getCategories();
    categories.forEach((category) => {
        const items = category.items;
        items.forEach((item) => {
            const settingsObject = item.toSettingsObject();
            if (settingsObject) {
                const propertyData = item.data;
                if (propertyData) {
                    const type = getPropertyType(propertyData);
                    let config;
                    switch (type) {
                        case 'SWITCH':
                            config = new BooleanProperty(propertyData);
                            configs.push(config);
                            if (!categoryTexts.includes(config.category)) categoryTexts.push(config.category);
                            break;
                        case 'TEXT':
                            config = new StringProperty(propertyData);
                            configs.push(config);
                            if (!categoryTexts.includes(config.category)) categoryTexts.push(config.category);
                            break;
                        case 'SLIDER':
                            config = new SliderProperty(propertyData);
                            configs.push(config);
                            if (!categoryTexts.includes(config.category)) categoryTexts.push(config.category);
                            break;
                        case 'COLOR':
                            config = new ColorProperty(propertyData);
                            configs.push(config);
                            if (!categoryTexts.includes(config.category)) categoryTexts.push(config.category);
                            break;
                        case 'SELECTOR':
                            config = new SelectorProperty(propertyData)
                            configs.push(config);
                            if (!categoryTexts.includes(config.category)) categoryTexts.push(config.category);
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    });
}

const readConfig = () => {
    const categoryRegex = /^\[(\S+)\]$/;
    const subCategoryRegex = /^\[(\S+)\.(\S+)\]$/;
    const optionRegex = /^"?(\S+)"?\="?(\S+)"?$/;
    const fileContents = FileLib.read('./config/ChatTriggers/modules/TakeshiAddons/config.toml');
    const lines = fileContents.split('\n');
    lines.forEach((l, i) => {
        const content = l.replaceAll(/\s/gi, '').replaceAll(/\t/gi, '')
        if (content !== '') {
            if (optionRegex.test(content)) {
                ChatLib.chat(`${i}: Option, ${content.match(optionRegex)[1]} = ${content.match(optionRegex)[2]}`);
            } else if (subCategoryRegex.test(content)) {
                ChatLib.chat(`${i}: Subcategory, ${content.match(subCategoryRegex)[1]} ${content.match(subCategoryRegex)[2]}`);
            } else if (categoryRegex.test(content)) {
                ChatLib.chat(`${i}: Category, ${content.match(categoryRegex)[1]}`);
            }
        }

    });
    settings.getConfig().getCategories().forEach((category) => {
        // console.log(category.toString());
        const items = category.items;
        items.forEach((item) => {
            const setting = item.toSettingsObject();
            if (setting) {
                const subcategory = item.subcategory;
                const propertyData = item.data;
                if (propertyData) {
                    const attributes = propertyData.attributesExt;
                    const dataType = attributes.type.toString();
                    const name = attributes.name;
                    const description = attributes.description;
                    console.log(`Type: ${dataType}, Name: ${name}, Desc: ${description}`);
                    if (name === 'Draw mob box') {
                        propertyData.setValue(!propertyData.getAsBoolean());
                    }
                }
            }
        })
    })
}

const playOpenAnimation = () => {
    const stepTrigger = register('step', () => {
        opacity += 0.04;
        if (opacity >= 1) {
            opacity = 1;
            stepTrigger.unregister();
        }
    });
    const closeTrigger = register('guiKey', (char, code, g, e) => {
        if (gui.class.isInstance(g) && code === 1) {
            cancel(e);
            playCloseAnimation();
            closeTrigger.unregister();
        }
    });
}

const playCloseAnimation = () => {
    const stepTrigger = register('step', () => {
        opacity -= 0.04;
        if (opacity <= 0) {
            opacity = 0;
            gui.close();
            stepTrigger.unregister();
        }
    });
}

const renderRoundedRectangle = (x, y, width, height, radius = 5) => {
    Renderer.drawCircle(new Color(0.1, 0.1, 0.1, opacity).getRGB(), x + radius, y + radius, radius, 10);
    Renderer.drawRect(new Color(0.1, 0.1, 0.1, opacity).getRGB(), x + radius, y, width - radius * 2, radius);
    Renderer.drawCircle(new Color(0.1, 0.1, 0.1, opacity).getRGB(), x + width - radius, y + radius, radius, 10);
    Renderer.drawRect(new Color(0.1, 0.1, 0.1, opacity).getRGB(), x, y + radius, width, height - radius * 2);
    Renderer.drawCircle(new Color(0.1, 0.1, 0.1, opacity).getRGB(), x + radius, y + height - radius, radius, 10);
    Renderer.drawRect(new Color(0.1, 0.1, 0.1, opacity).getRGB(), x + radius, y + height - radius, width - radius * 2, radius);
    Renderer.drawCircle(new Color(0.1, 0.1, 0.1, opacity).getRGB(), x + width - radius, y + height - radius, radius, 10);

    Renderer.drawLine(new Color(0.5, 0.5, 0.5, opacity).getRGB(), x + width / 4, y + radius, x + width / 4, y + height - radius, 1);
}

register('gameLoad', () => {
    loadConfig(settings);
});

register('renderOverlay', () => {
    if (!gui.isOpen()) return;
    if (opacity === 0) playOpenAnimation();
    const screenWidth = Renderer.screen.getWidth(), screenHeight = Renderer.screen.getHeight();
    const width = screenWidth * 0.6;
    const height = screenHeight * 0.6;
    const topX = screenWidth * 0.2;
    const topY = screenHeight * 0.2;
    GlStateManager.func_179094_E();
    GlStateManager.func_179097_i();
    renderRoundedRectangle(topX, topY, width, height);
    GlStateManager.func_179126_j();
    GlStateManager.func_179121_F();
}).setPriority(Priority.LOWEST);



register('command', () => {
    gui.open();
}).setCommandName('debugopengui');

register('command', () => {
    readConfig();
}).setCommandName('debugconfig');