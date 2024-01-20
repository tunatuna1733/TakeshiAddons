import { icespray, lb } from "../../utils/dungeon";

const debuffKey = new KeyBind('Broadcast estimated debuff results', Keyboard.KEY_NONE, 'TakeshiAddons');

register('renderWorld', () => {
    if (debuffKey.isPressed()) {
        ChatLib.command(`pc LB:${lb}, IceSpray: ${icespray}`);
    }
});