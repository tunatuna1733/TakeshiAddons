import settings from "../../settings";
import getCurrentArmor from "../../utils/current_armor";
import { data } from "../../utils/data";
import { registerWhen } from "../../utils/register";

const getArmorHUDRenderCoords = () => {
    const x = data.armor.x;
    const y = data.armor.y;
    return [x, y];
}

const setArmorHUDRenderCoords = (x, y) => {
    data.armor.x = x;
    data.armor.y = y;
    data.save();
    return;
}

registerWhen(register("renderOverlay", () => {
    const [render_x, render_y] = getArmorHUDRenderCoords();

    const [helmet, chestplate, leggings, boots] = getCurrentArmor();

    const hud_scale = 1.7;
    helmet?.draw(render_x, render_y, hud_scale);
    chestplate?.draw(render_x, render_y + 27, hud_scale);
    leggings?.draw(render_x, render_y + 54, hud_scale);
    boots?.draw(render_x, render_y + 81, hud_scale);
}), () => settings.armorhud)

export const armor_hud_move_gui = new Gui();
const gui_string = 'Drag to move Armor HUD';
const gui_text_component = new Text(gui_string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(gui_string) * 2, Renderer.screen.getHeight() / 2 - 50).setColor(Renderer.color(255, 55, 55)).setScale(4);

armor_hud_move_gui.registerDraw(() => {
    gui_text_component.draw();
});

register('dragged', (dx, dy) => {
    if (!armor_hud_move_gui.isOpen()) return;

    const [current_x, current_y] = getArmorHUDRenderCoords();
    setArmorHUDRenderCoords(current_x + dx, current_y + dy);
});