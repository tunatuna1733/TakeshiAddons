/*
Im gonna work on this once UITextInput and State work correctly

const asKey = Client.getKeyBindFromKey(Keyboard.KEY_J, 'Open attribute search GUI');

import { CenterConstraint, ConstantColorConstraint, UIBlock, UIContainer, UIRoundedRectangle, UIText, UITextInput, Window } from '../../../Elementa';

let guiOpen = false;
const gui = new Gui();
const window = new Window();

const createSearchGui = () => {
    window.clearChildren();
    const background = new UIBlock()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((Renderer.screen.getWidth()).pixels())
        .setHeight((Renderer.screen.getHeight()).pixels())
        .setColor(new Color(30 / 255, 30 / 255, 30 / 255, 0.8))
        .setChildOf(window);

    const inputContainer = new UIContainer()

    const itemNameInputBlock = new UIBlock()
        .setX((50).pixels())
        .setY((50).pixels())
        .setWidth((200).pixels())
        .setHeight((50).pixels())
        .onMouseClick(() => itemNameInput.grabWindowFocus())
        .setChildOf(inputContainer);

    const itemNameInput = new UITextInput()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((200).pixels())
        .setHeight((50).pixels())
        .setChildOf(itemNameInputBlock);
}

register('renderOverlay', () => {
    if (asKey.isPressed()) {
        // create gui
        guiOpen = true;
    }
    if (guiOpen) {
        gui.open();
        window.draw();
    }
}).setPriority(Priority.LOWEST);

register('guiClosed', (e) => {
    if (guiOpen && e.class.isInstance(gui)) guiOpen = !guiOpen;
});

*/