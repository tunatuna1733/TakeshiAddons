const JFrame = Java.type('javax.swing.JFrame');
const JLabel = Java.type("javax.swing.JLabel");
const FlowLayout = Java.type('java.awt.FlowLayout');
const Font = Java.type("java.awt.Font");
const Color = Java.type("java.awt.Color");

const jFrame = new JFrame("Fishing Timer");
const jLabel = new JLabel("");

jFrame.setSize(200, 100);
jFrame.setLayout(new FlowLayout());
jFrame.setAlwaysOnTop(true);
jFrame.add(jLabel);

const contentPane = jFrame.getContentPane();
contentPane.setBackground(Color.BLACK);

jLabel.setFont(new Font("Segoe UI", Font.PLAIN, 22));

const fishingTimerRegex = /^\d\.\d$/

register('renderWorld', () => {
    let found = false;
    World.getAllEntitiesOfType(Java.type('net.minecraft.entity.item.EntityArmorStand').class).forEach((armorStands) => {
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
        jLabel.setText("");
    }
});

register('command', (args) => {
    jFrame.setVisible(true);
}).setCommandName('debugfishingtimer');