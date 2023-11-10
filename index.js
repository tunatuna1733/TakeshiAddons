/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { data } from "./utils/data";
import settings from "./settings";
import { setRegisters } from "./utils/register";

import "./features/hud/armor";
import { armor_hud_move_gui } from "./features/hud/armor";
import "./features/hud/equipment";
import { equipment_hud_move_gui } from "./features/hud/equipment";
import "./features/hud/kuudra_armor_stack";
import { dominus_hud_move_gui, hydra_hud_move_gui } from "./features/hud/kuudra_armor_stack";
import "./features/hud/reforge";
import { reforge_hud_move_gui } from "./features/hud/reforge";
import "./features/hud/ragnarock";
import { rag_hud_move_gui } from "./features/hud/ragnarock";
import "./features/hud/lifeline";
import { ll_hud_move_gui } from "./features/hud/lifeline";
import "./features/hud/reaper";
import { reaper_hud_move_gui } from "./features/hud/reaper";

data.autosave();

// global vars
let ping = 0;
let pingStart;
let isPingCalc = false;

register('command', (args) => {
    if (!args) {
        settings.openGUI();
    } else if (args == 'armorhud') {
        armor_hud_move_gui.open();
    } else if (args == 'equipmenthud') {
        equipment_hud_move_gui.open();
    } else if (args == 'dominushud') {
        dominus_hud_move_gui.open();
    } else if (args == 'hydrahud') {
        hydra_hud_move_gui.open();
    } else if (args == 'reforgehud') {
        reforge_hud_move_gui.open();
    } else if (args == 'raghud') {
        rag_hud_move_gui.open();
    } else if (args == 'lifelinehud') {
        ll_hud_move_gui.open();
    } else if (args == 'reaperhud') {
        reaper_hud_move_gui.open();
    }
}).setCommandName('takeshi', true).setAliases('takeshiaddons');

register('guiClosed', (event) => {
    if (event.toString().includes("vigilance")) setRegisters();
})

// ping things ref: HypixelPing by SergeantSar
register("step", () => {
    pingStart = Date.now();
    ChatLib.say("/s");
    isPingCalc = true;
}).setDelay(15);

register("chat", (event) => {
    if (!isPingCalc) return;
    const unformattedMessage = ChatLib.getChatMessage(event);
    const message = ChatLib.removeFormatting(unformattedMessage.toString());

    if (message !== "You do not have permission to use this command!") return;

    ping = Date.now() - pingStart;
    cancel(event);
    isPingCalc = false;
    if (ping > 1000) {
        ChatLib.chat(`[MyUtils] You got insane ping!!! ${ping}ms`);
    }
});

register("renderOverlay", () => {
    // ping
    Renderer.drawString("Ping: " + ping, 20, 20);
});

register('command', () => {
    const lines = Scoreboard.getLines(false);
    lines.map((line) => {
        ChatLib.chat(`${line.getName().removeFormatting()}`);
    });
}).setCommandName('scc');
