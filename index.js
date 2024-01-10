/// <reference types="../CTAutocomplete" />
/// <reference lib="es2022" />

// import { request } from 'axios';
import { request } from '../axios';
import { data, gardenData, resetData } from "./utils/data";
import settings from "./settings";
import { setRegisters } from "./utils/register";
import hud_manager from "./utils/hud_manager";
const Toolkit = Java.type('java.awt.Toolkit');
const StringSelection = Java.type('java.awt.datatransfer.StringSelection');
const EssentialAPI = Java.type('gg.essential.api.EssentialAPI');
const EssentialNotifications = EssentialAPI.getNotifications();

import "./features/hud/armor";
import "./features/hud/equipment";
import "./features/hud/kuudra_armor_stack";
import "./features/hud/reforge";
import "./features/hud/ragnarock";
import "./features/hud/lifeline";
import "./features/hud/reaper";
import "./features/hud/last_breath";
import "./features/hud/flare";
import "./features/hud/inventory";
import "./features/hud/composter";
import "./features/hud/soulflow";

import "./features/gui/attribute_lb";
import "./features/gui/auctions";

import "./features/dungeon/terminal";
import "./features/dungeon/relic";

import "./features/kuudra/dropship";
import "./features/kuudra/energized_chunk";
import "./features/kuudra/kuudra_price";

import { CHAT_PREFIX } from "./data/chat";

data.autosave();
gardenData.autosave();

const getVersion = () => {
    const metadata = FileLib.read('./config/ChatTriggers/modules/TakeshiAddons/metadata.json');
    if (metadata === '') {
        console.log('[Takeshi] Failed to read metadata file.');
        return '0.0.0';
    }
    const metadataJson = JSON.parse(metadata);
    return metadataJson.version;
}

const printHelp = () => {
    ChatLib.chat('&dTakeshiAddons Help');
    ChatLib.chat('&7|  &eRun &c"/takeshi" &eto open settings.');
    ChatLib.chat('&7| &bCommands');
    ChatLib.chat('&7|  &c"/scc"&7: &aPrint your scoreboard to chat so that you can copy it.');
    ChatLib.chat('&7|  &c"/cpp"&7: &aCopy your purse text on your scoreboard');
    ChatLib.chat('&7| &bKeybind');
    ChatLib.chat('&7|  &aYou can bind a key for opening kuudra item price gui.');
}

const printChangelog = (version) => {
    request({
        url: 'https://raw.githubusercontent.com/tunatuna1733/TakeshiAddons/master/changelog.json'
    }).then((res) => {
        const response = res.data;
        const changelogs = response[version];
        if (!changelogs) {
            console.log(`[Takeshi] Failed to fetch changelog for version ${version}`);
            return;
        }
        ChatLib.chat(`&dTakeshiAddons Changelog &av${version}`);
        changelogs.forEach((changelog) => {
            ChatLib.chat(`&7- &e${changelog}`);
        });
    }).catch((e) => {
        console.log(`[Takeshi] Failed to fetch changelog for version ${version}`);
        console.dir(e, { depth: null });
    })
}

register('command', (args) => {
    if (!args) {
        settings.openGUI();
    } else if (args == 'movehud') {
        hud_manager.openGui();
    } else if (args == 'resetloc') {
        resetData();
    } else if (args == 'help') {
        printHelp();
    }
}).setCommandName('takeshi', true).setAliases('takeshiaddons');

register('gameLoad', () => {
    if (!data.first) {
        ChatLib.command('takeshi resetloc', true);
        data.first = true;
        data.save();
        ChatLib.chat('&a-------------------------------------');
        ChatLib.chat('      &bWelcome to &dTakeshiAddons!');
        ChatLib.chat('&a Type /takeshi to open settings');
        ChatLib.chat('&a-------------------------------------');
    }
    if (!data.helpPrinted) {
        ChatLib.command('takeshi help', true);
        data.helpPrinted = true;
        data.save();
    }
    const currentVersion = getVersion();
    if (currentVersion !== data.version) {
        data.version = currentVersion;
        data.save();
        printChangelog();
    }
});

register('guiClosed', (event) => {
    if (event.toString().includes("vigilance")) setRegisters();
});

register('gameUnload', () => {
    data.save();
    gardenData.save();
});

register('command', () => {
    const lines = Scoreboard.getLines(false);
    lines.map((line) => {
        ChatLib.chat(`${line.getName().removeFormatting()}`);
    });
}).setCommandName('scc');

register('command', () => {
    let copied = false;
    const lines = Scoreboard.getLines(false);
    lines.map((line) => {
        if (line.getName().includes('Piggy') || line.getName().includes('Purse')) {
            const selection = new StringSelection(ChatLib.removeFormatting(line.getName()));
            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(selection, null);
            EssentialNotifications.push('Purse copied!', 'Copied your purse to your clipboard.', 3);
            copied = true;
        }
    });
    if (!copied) ChatLib.chat(`${CHAT_PREFIX} &cFailed to copy your purse :(`);
}).setCommandName('copypurse').setAliases(['cpp']);