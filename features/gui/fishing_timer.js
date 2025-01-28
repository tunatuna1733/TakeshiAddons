import settings from '../../settings';

const JFrame = Java.type('javax.swing.JFrame');
const JLabel = Java.type('javax.swing.JLabel');
const JPanel = Java.type('javax.swing.JPanel');
const UIManager = Java.type('javax.swing.UIManager');
const MetalLookAndFeel = Java.type('javax.swing.plaf.metal.MetalLookAndFeel');
const BorderLayout = Java.type('java.awt.BorderLayout');
const FlowLayout = Java.type('java.awt.FlowLayout');
const Font = Java.type('java.awt.Font');
const Color = Java.type('java.awt.Color');

const EntityArmorStandClass = Java.type('net.minecraft.entity.item.EntityArmorStand').class;
const EntityFishHookClass = Java.type('net.minecraft.entity.projectile.EntityFishHook').class;

JFrame.setDefaultLookAndFeelDecorated(true);
UIManager.setLookAndFeel(new MetalLookAndFeel());

const jFrame = new JFrame('Fishing Timer');
const jLabel = new JLabel('');
const mainPanel = new JPanel();

let x = 200;
let y = 100;

jFrame.setSize(x, y);
jFrame.setLayout(new BorderLayout());
jFrame.setAlwaysOnTop(true);
jFrame.setUndecorated(true);
jFrame.setOpacity(settings.fishingtimercolor.getAlpha() / 255);

mainPanel.setLayout(new FlowLayout());
mainPanel.add(jLabel);
mainPanel.setBackground(
  new Color(
    settings.fishingtimercolor.getRed() / 255,
    settings.fishingtimercolor.getGreen() / 255,
    settings.fishingtimercolor.getBlue() / 255,
  ),
);

jFrame.add(mainPanel, BorderLayout.CENTER);

jLabel.setFont(new Font('Segoe UI', Font.PLAIN, 40));

const fishingTimerRegex = /^\d\.\d$/;

register('renderWorld', () => {
  if (jFrame.isVisible()) {
    if (x !== jFrame.getWidth() || y !== jFrame.getHeight()) {
      x = jFrame.getWidth();
      y = jFrame.getHeight();
      const baseSize = Math.min(x, y);
      jLabel.setFont(new Font('Segoe UI', Font.PLAIN, Number.parseInt(baseSize / 2)));
    }
    jFrame.setOpacity(settings.fishingtimercolor.getAlpha() / 255);
    mainPanel.setBackground(
      new Color(
        settings.fishingtimercolor.getRed() / 255,
        settings.fishingtimercolor.getGreen() / 255,
        settings.fishingtimercolor.getBlue() / 255,
      ),
    );
    let found = false;
    World.getAllEntitiesOfType(EntityArmorStandClass).forEach((armorStands) => {
      const name = armorStands.getName().removeFormatting();
      if (name.match(fishingTimerRegex)) {
        jLabel.setForeground(Color.YELLOW);
        jLabel.setText(name);
        found = true;
      } else if (name === '!!!') {
        jLabel.setForeground(Color.RED);
        jLabel.setText('!!!');
        found = true;
      }
    });
    if (!found) {
      let hookFound = false;
      World.getAllEntitiesOfType(EntityFishHookClass).forEach((hook) => {
        if (hook.getEntity().field_146042_b.func_70005_c_() === Player.getName()) {
          hookFound = true;
        }
      });
      if (hookFound) {
        jLabel.setText('');
      } else {
        if (settings.fishingtimerwarning) {
          jLabel.setForeground(Color.RED);
          jLabel.setText('ROD!!!');
        } else jLabel.setText('');
      }
    }
  }
});

export const openFishingTimer = () => {
  jFrame.setVisible(true);
};
