import { CHAT_PREFIX } from "../../data/chat";
import settings from "../../settings";
import { customHudsData } from "../../utils/data";
import { Hud } from "../../utils/hud";
import hud_manager from "../../utils/hud_manager";
import { isInSkyblock } from "../../utils/hypixel";

let categories = [];
let categoryTexts = [];
let huds = [];

const getHudText = (name) => {
    let text = '';
    categories.forEach((c) => {
        if (
            (c.category.match(/^§r§[0-9a-f]§l.+\:/) &&
                c.category.match(/^§r§[0-9a-f]§l(.+)\:/)[1].removeFormatting() === name) ||
            (c.category.match(/^§r§l§r§[0-9a-f]§l.+\:/) &&
                c.category.match(/^§r§l§r§[0-9a-f]§l(.+)\:/)[1].removeFormatting() === name)
        ) {
            text = c.category + '\n' + c.details.join('\n');
        }
    });
    if (text === '') text = name;
    return text;
}

export const loadHuds = () => {
    huds.forEach(h => h.remove());
    huds = [];
    customHudsData.data.forEach((h) => {
        if (settings.tablistbackground) {
            const hud = new Hud(h.name, h.name, hud_manager, customHudsData, true, true, settings.tablistbackgroundcolor.getRGB());
            hud.setText(getHudText(h.name));
            huds.push(hud);
        } else {
            const hud = new Hud(h.name, h.name, hud_manager, customHudsData, true);
            hud.setText(getHudText(h.name));
            huds.push(hud);
        }
    });
};

register('gameLoad', () => {
    loadHuds();
});

register('renderOverlay', () => {
    huds.forEach((h) => {
        categories.forEach((c) => {
            if (
                (c.category.match(/^§r§[0-9a-f]§l.+\:/) &&
                    c.category.match(/^§r§[0-9a-f]§l(.+)\:/)[1].removeFormatting() === h.name) ||
                (c.category.match(/^§r§l§r§[0-9a-f]§l.+\:/) &&
                    c.category.match(/^§r§l§r§[0-9a-f]§l(.+)\:/)[1].removeFormatting() === h.name)
            ) {
                const text = c.category + '\n' + c.details.join('\n');
                h.draw(text);
            }
        });
    });
});

register('step', () => {
    if (!isInSkyblock()) return;
    if (!TabList) return;
    if (!TabList.getNames()) return;
    if (TabList.getNames().length < 20 * 4) return;
    categories = [];
    categoryTexts = [];
    let currentCategory = '';
    let details = [];
    TabList.getNames().forEach((n, i) => {
        if (n.match(/^§r§[0-9a-f]§l.+\:/)) {
            currentCategory = n;
            categoryTexts.push(n.match(/^§r§[0-9a-f]§l(.+)\:/)[1].removeFormatting());
        } else if (n.match(/^§r§l§r§[0-9a-f]§l.+\:/)) {
            if (currentCategory !== '') {
                categories.push({
                    category: currentCategory,
                    details,
                });
                currentCategory = '';
                details = [];
            }
            currentCategory = n;
            categoryTexts.push(n.match(/^§r§l§r§[0-9a-f]§l(.+)\:/)[1].removeFormatting());
        } else if (n !== '§r' && currentCategory !== '') {
            details.push(n);
        } else if (n === '§r' && currentCategory !== '') {
            categories.push({
                category: currentCategory,
                details
            });
            currentCategory = '';
            details = [];
        }

        if (i % 20 === 19 && currentCategory !== '') {
            categories.push({
                category: currentCategory,
                details
            });
            currentCategory = '';
            details = [];
        }
    });
}).setDelay(1);

export const addCustomHud = () => {
    ChatLib.chat(`${CHAT_PREFIX} &aPlease select the tablist widget you want to add as a hud.`);
    categoryTexts.forEach(c => {
        ChatLib.chat(new TextComponent(` &e${c}`).setClick('run_command', `/takeshiaddcustomtablisthud ${c}`));
    });
};

register('command', (...args) => {
    if (!args || typeof args === 'undefined') {
        ChatLib.chat(`${CHAT_PREFIX} &c[ERROR] Please specify the name.`);
        return;
    }
    const categoryName = args.join(' ');
    if (customHudsData.data.find(h => h.name === categoryName)) {
        ChatLib.chat(`${CHAT_PREFIX} &c[ERROR] You've already added this!`);
    } else {
        customHudsData.data.push({
            name: categoryName,
            x: customHudsData.data.length * 0.05,
            y: customHudsData.data.length * 0.05,
            scale: 1
        });
        customHudsData.save();
        ChatLib.chat(`${CHAT_PREFIX} &aAdded &e${categoryName} &aas a hud!`);
        loadHuds();
    }
}).setCommandName('takeshiaddcustomtablisthud', true);

export const removeCustomHud = () => {
    ChatLib.chat(`${CHAT_PREFIX} &aPlease select the hud you want to &c&lremove&r&a.`);
    customHudsData.data.forEach((h) => {
        ChatLib.chat(new TextComponent(` &e${h.name}`).setClick('run_command', `/takeshiremovecustomtablisthud ${h.name}`));
    });
}

register('command', (...args) => {
    if (!args || typeof args === 'undefined') {
        ChatLib.chat(`${CHAT_PREFIX} &c[ERROR] Please specify the name.`);
        return;
    }
    const categoryName = args.join(' ');
    customHudsData.data = customHudsData.data.filter(h => h.name !== categoryName);
    customHudsData.save();
    ChatLib.chat(`${CHAT_PREFIX} &cRemoved &e${categoryName} &cfrom huds.`);
    loadHuds();
}).setCommandName('takeshiremovecustomtablisthud', true);