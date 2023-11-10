import settings from "../../settings";
import { data } from "../../utils/data";
import { registerWhen } from "../../utils/register";

const getReforgeHUDRenderCoords = () => {
    const x = data.reforge.x;
    const y = data.reforge.y;
    return [x, y];
}

const setReforgeHUDRenderCoords = (x, y) => {
    data.reforge.x = x;
    data.reforge.y = y;
    data.save();
    return;
}

registerWhen(register('chat', (power) => {
    data.reforge.power = power;
    data.save();
}).setChatCriteria('You selected the ${reforge} power for your Accessory Bag!'), () => true);

registerWhen(register("renderOverlay", () => {
    Renderer.drawString("Power: " + data.reforge.power, data.reforge.x, data.reforge.y);
}), () => settings.reforgehud);

export const reforge_hud_move_gui = new Gui();
const gui_string = 'Drag to move Reforge HUD';
const gui_text_component = new Text(gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

reforge_hud_move_gui.registerDraw(() => {
    gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!reforge_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getReforgeHUDRenderCoords();
    setReforgeHUDRenderCoords(current_x + dx, current_y + dy);
});