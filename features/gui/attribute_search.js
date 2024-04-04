import { CenterConstraint, ConstantColorConstraint, UIBlock, UIContainer, UIRoundedRectangle, UIText, UITextInput, Window, WindowScreen } from '../../../Elementa';

const createSearchGui = (window) => {
    window.clearChildren();
    const background = new UIRoundedRectangle(5)
        .setX((Renderer.screen.getWidth() * 0.2).pixels())
        .setY((Renderer.screen.getHeight() * 0.2).pixels())
        .setWidth((Renderer.screen.getWidth() * 0.6).pixels())
        .setHeight((Renderer.screen.getHeight() * 0.6).pixels())
        .setColor(new Color(40 / 255, 40 / 255, 40 / 255, 0))
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

const AuctionSearch = new JavaAdapter(WindowScreen, {
    init() {
        createSearchGui(this.window);
    }
});

register('command', () => {
    AuctionSearch.init();
    GuiHandler.openGui(AuctionSearch);
}).setCommandName('debugopenattributesearch');