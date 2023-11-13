/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { data } from "./utils/data";
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

data.autosave();

register('command', (args) => {
    if (!args) {
        settings.openGUI();
    } else if (args == 'movehud') {
        hud_manager.openGui();
    }
}).setCommandName('takeshi', true).setAliases('takeshiaddons');

register('guiClosed', (event) => {
    if (event.toString().includes("vigilance")) setRegisters();
});

register('command', () => {
    const lines = Scoreboard.getLines(false);
    lines.map((line) => {
        ChatLib.chat(`${line.getName().removeFormatting()}`);
    });
}).setCommandName('scc');
