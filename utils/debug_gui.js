const Color = Java.type('java.awt.Color');

const gui = new Gui();
let opacity = 0;

const playOpenAnimation = () => {
    const tickTrigger = register('tick', () => {
        opacity += 0.1;
        if (opacity >= 1) {
            opacity = 1;
            tickTrigger.unregister();
        }
    });
}

const playCloseAnimation = () => {
    const tickTrigger = register('tick', () => {
        opacity -= 0.1;
        if (opacity <= 0) {
            opacity = 0;
            gui.close();
            tickTrigger.unregister();
        }
    });
}

register('renderOverlay', () => {
    if (!gui.isOpen()) return;
    if (opacity === 0) playOpenAnimation();
    const screenWidth = Renderer.screen.getWidth(), screenHeight = Renderer.screen.getHeight();
    const width = screenWidth * 0.6;
    const height = screenHeight * 0.6;
    const topX = screenWidth * 0.2;
    const topy = screenHeight * 0.2;
    Renderer.drawRect(new Color(0.1, 0.1, 0.1, opacity).getRGB(), topX, topy, width, height);
});

register('guiKey', (char, code, g, e) => {
    if (g.class === gui.class && code === 1) {
        cancel(e);
        playCloseAnimation();
    }
});

register('command', () => {
    gui.open();
}).setCommandName('debugopengui');