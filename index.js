/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { data, gardenData, resetData } from "./utils/data";
import settings from "./settings";
import { setRegisters } from "./utils/register";
import hud_manager from "./utils/hud_manager";

import "./features/hud/armor";
import "./features/hud/equipment";
import "./features/hud/kuudra_armor_stack";
import "./features/hud/reforge";
import "./features/hud/ragnarock";
import "./features/hud/lifeline";
import "./features/hud/reaper";
import "./features/hud/last_breath";
import "./features/hud/kuudra_price";
import "./features/hud/flare";
import "./features/hud/inventory";
import "./features/hud/composter";
import "./features/hud/dropship";

import "./features/gui/attribute_lb";
import "./features/gui/auctions";

import "./features/dungeon/terminal";

data.autosave();
gardenData.autosave();

register('command', (args) => {
    if (!args) {
        settings.openGUI();
    } else if (args == 'movehud') {
        hud_manager.openGui();
    } else if (args == 'resetloc') {
        resetData();
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
