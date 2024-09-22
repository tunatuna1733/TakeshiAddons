let helmet = Player.armor.getHelmet();
let chestplate = Player.armor.getChestplate();
let leggings = Player.armor.getLeggings();
let boots = Player.armor.getBoots();

register('step', () => {
  helmet = Player.armor.getHelmet();
  chestplate = Player.armor.getChestplate();
  leggings = Player.armor.getLeggings();
  boots = Player.armor.getBoots();
}).setFps(3);

export const getCurrentArmor = () => {
  return [helmet, chestplate, leggings, boots];
};
