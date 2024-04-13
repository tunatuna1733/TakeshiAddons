import { AdditiveConstraint, CenterConstraint, ChildBasedMaxSizeConstraint, ChildBasedSizeConstraint, ConstantColorConstraint, FillConstraint, OutlineEffect, ScissorEffect, ScrollComponent, SiblingConstraint, UIBlock, UIContainer, UIRoundedRectangle, UIText, UITextInput, Window, WindowScreen } from '../../../Elementa';
import { getAllItems } from '../../utils/auction';
const Color = Java.type('java.awt.Color');

let itemId = '';
// let itemSuggestions = [];

let itemNameInput;
let itemSuggestionScroll;

/**
 * Create item name suggestion scroll component
 * @param {string} currentText 
 * @param {any} parent
 */
const createItemNameSuggestion = (currentText, parent) => {
    if (currentText.length <= 3) return;
    parent.clearChildren();

    const scroll = new ScrollComponent()
        .setX((0).pixels())
        .setY(parent.getHeight())
        .setWidth((100).percent())
        .setHeight((100).pixels())
        .setChildOf(parent);

    const itemList = getAllItems();

    itemList.forEach((item) => {
        if (item.name.toLowerCase().includes(currentText)) {
            const itemContainer = new UIContainer()
                .setX((0).pixels())
                .setY(new SiblingConstraint())
                .setWidth((100).percent())
                .setHeight(new ChildBasedSizeConstraint(5))
                .onMouseClick(() => {
                    ChatLib.chat(`Clicked: ${item.name}`);
                    itemId = item.id;
                    itemNameInput.setText(item.name);
                    parent.clearChildren();
                })
                .setChildOf(scroll);

            new UIText(item.name)
                .setX((2).pixels())
                .setY(new CenterConstraint())
                .setChildOf(itemContainer);
        }
    });

    return scroll;
}

const createSearchGui = (window) => {
    window.clearChildren();
    const background = new UIRoundedRectangle(5)
        .setX((Renderer.screen.getWidth() * 0.2).pixels())
        .setY((Renderer.screen.getHeight() * 0.2).pixels())
        .setWidth((Renderer.screen.getWidth() * 0.6).pixels())
        .setHeight((Renderer.screen.getHeight() * 0.6).pixels())
        .setColor(new Color(40 / 255, 40 / 255, 40 / 255, 1))
        .setChildOf(window);

    const inputContainer = new UIContainer()
        .setX((30).pixels())
        .setY((30).pixels())
        .setWidth(new ChildBasedSizeConstraint(10))
        .setHeight(new ChildBasedSizeConstraint(10))
        .setChildOf(background);

    const itemNameInputLabel = new UIText('Item Name')
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((130).pixels())
        .setHeight((15).pixels())
        .setTextScale((0.5).pixels())
        .setChildOf(inputContainer);

    const itemNameInputBlock = new UIBlock()
        .setX((5).pixels())
        .setY(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
        .setWidth((130).pixels())
        .setHeight((15).pixels())
        .onMouseClick(() => {
            if (itemNameInput)
                itemNameInput.grabWindowFocus()
        })
        .setColor(new Color(40 / 255, 40 / 255, 40 / 255, 0))
        .enableEffect(new OutlineEffect(Color.LIGHT_GRAY, 1, true))
        .setChildOf(inputContainer);

    itemNameInput = new UITextInput()
        .setX((2).pixels())
        .setY(new CenterConstraint())
        .setWidth((126).pixels())
        .setHeight((12).pixels())
        .onUpdate((text) => {
            ChatLib.chat(`item name updated: ${text}`);
            itemSuggestionScroll = createItemNameSuggestion(text, itemNameInput);
        })
        .setChildOf(itemNameInputBlock);

    /*
    const itemNameSuggestionBlock = new UIContainer()
        .setX((0).pixels())
        .setY((15).pixels())
        .setWidth((130).pixels())
        .setHeight((0).pixels())
        .onMouseClick(() => {
            if (itemSuggestionScroll) itemSuggestionScroll.grabWindowFocus();
        })
        .setChildOf(itemNameInputBlock)
    */
}

const AuctionSearch = new JavaAdapter(WindowScreen, {
    init() {
        createSearchGui(this.getWindow());
    }
});

register('command', () => {
    AuctionSearch.init();
    GuiHandler.openGui(AuctionSearch);
}).setCommandName('debugopenattributesearch');