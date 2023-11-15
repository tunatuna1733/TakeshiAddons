const lbKey = Client.getKeyBindFromKey(Keyboard.KEY_K, 'View Lowest bin with attribute considered');

import { request } from 'axios';
import { CenterConstraint, ConstantColorConstraint, UIBlock, UIContainer, UIRoundedRectangle, UIText, Window } from '../../../Elementa';
import getItemId from '../../utils/item_id';
import { SkyblockAttributes } from '../../utils/attributes';
const Color = Java.type('java.awt.Color');
const UIItem = (item) => {
    return new JavaAdapter(UIBlock, {
        draw: function () {
            item.draw(this.getLeft(), this.getTop(), this.getHeight() / 16);
        }
    });
}
const formatNumToCoin = (n) => {
    const integer_n = n.toFixed();
    return integer_n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let guiOpen = false;

const cardWidth = 200;
const cardHeight = 150;
const cardSpace = 10;
const cardY = 35;

const gui = new Gui();
const window = new Window();

const createAuctionGui = (item) => {
    const itemId = getItemId(item);
    const attributes = item.getNBT()?.get('tag')?.get('ExtraAttributes')?.get('attributes')?.toObject();
    window.clearChildren();
    const background = new UIBlock()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((Renderer.screen.getWidth()).pixels())
        .setHeight((Renderer.screen.getHeight()).pixels())
        .setColor(new Color(30 / 255, 30 / 255, 30 / 255, 0.8))
        .setChildOf(window);

    const auctionCardContainer = new UIContainer()
        .setX(new CenterConstraint())
        .setY((100).pixels())
        .setWidth((cardWidth * 3 + cardSpace * 2).pixels())
        .setHeight((cardHeight + cardY).pixels())
        .setChildOf(background);

    const itemNameContainer = new UIContainer()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((cardWidth * 3 + cardSpace * 2).pixels())
        .setHeight(cardY.pixels())
        .setChildOf(auctionCardContainer);
    itemNameContainer.addChildren(
        UIItem(item)
            .setX((0).pixels())
            .setY(new CenterConstraint())
            .setWidth((32).pixels())
            .setHeight((32).pixels()),
        new UIText(item.getName(), false)
            .setX((40).pixels())
            .setY(new CenterConstraint())
            .setTextScale((3).pixels())
    );

    const onlyFirstAuctionCard = new UIRoundedRectangle(10.0)
        .setX((0).pixels())
        .setY(cardY.pixels())
        .setWidth(cardWidth.pixels())
        .setHeight(cardHeight.pixels())
        .setColor(Color.DARK_GRAY)
        .setChildOf(auctionCardContainer)
        .addChild(
            new UIText('Loading...')
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((2).pixels())
        );
    const onlySecondAuctionCard = new UIRoundedRectangle(10.0)
        .setX((cardWidth + cardSpace).pixels())
        .setY(cardY.pixels())
        .setWidth(cardWidth.pixels())
        .setHeight(cardHeight.pixels())
        .setColor(Color.DARK_GRAY)
        .setChildOf(auctionCardContainer)
        .addChild(
            new UIText('Loading...')
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((2).pixels())
        );
    const bothAuctionCard = new UIRoundedRectangle(10.0)
        .setX((cardWidth * 2 + cardSpace * 2).pixels())
        .setY(cardY.pixels())
        .setWidth(cardWidth.pixels())
        .setHeight(cardHeight.pixels())
        .setColor(Color.DARK_GRAY)
        .setChildOf(auctionCardContainer)
        .addChild(
            new UIText('Loading...')
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((2).pixels())
        );

    const [attributeId1, attributeId2] = Object.keys(attributes);
    const [attributeLevel1, attributeLevel2] = [attributes[attributeId1], attributes[attributeId2]];
    let attributeName1 = '', attributeName2 = '';
    SkyblockAttributes.forEach((a) => {
        if (a.id === attributeId1) attributeName1 = a.name;
        if (a.id === attributeId2) attributeName2 = a.name;
    });
    let url = `https://skyblock-hono-production.up.railway.app/lb?itemId=${itemId}&attributeId1=${attributeId1}&attributeLevel1=${attributeLevel1}`;
    if (attributeId2)
        url += `&attributeId2=${attributeId2}&attributeLevel2=${attributeLevel2}`;
    request({
        url: url
    }).then((res) => {
        const response = res.data;
        if (response.success === false) {
            onlyFirstAuctionCard.clearChildren();
            onlySecondAuctionCard.clearChildren();
            bothAuctionCard.clearChildren();
            new UIText('Error :(')
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((2).pixels())
                .setColor(new ConstantColorConstraint(Color.RED))
                .setChildOf(onlyFirstAuctionCard);
        } else {
            if (response.data.first) {
                onlyFirstAuctionCard.clearChildren();
                const price = formatNumToCoin(parseInt(response.data.first.price));
                new UIText(`${attributeName1} ${attributeLevel1}`)
                    .setX((10).pixels())
                    .setY((10).pixels())
                    .setChildOf(onlyFirstAuctionCard);
                new UIText(`Price: ${price} coins`)
                    .setX((10).pixels())
                    .setY((25).pixels())
                    .setChildOf(onlyFirstAuctionCard);
            } else {
                onlyFirstAuctionCard.clearChildren();
                new UIText('No data :(')
                    .setX(new CenterConstraint())
                    .setY(new CenterConstraint())
                    .setTextScale((2).pixels())
                    .setChildOf(onlyFirstAuctionCard);
            }
            if (response.data.second) {
                onlySecondAuctionCard.clearChildren();
                const price = formatNumToCoin(parseInt(response.data.second.price));
                new UIText(`${attributeName2} ${attributeLevel2}`)
                    .setX((10).pixels())
                    .setY((10).pixels())
                    .setChildOf(onlySecondAuctionCard);
                new UIText(`Price: ${price} coins`)
                    .setX((10).pixels())
                    .setY((25).pixels())
                    .setChildOf(onlySecondAuctionCard);
            } else {
                onlySecondAuctionCard.clearChildren();
                new UIText('No data :(')
                    .setX(new CenterConstraint())
                    .setY(new CenterConstraint())
                    .setTextScale((2).pixels())
                    .setChildOf(onlySecondAuctionCard);
            }
            if (response.data.both) {
                bothAuctionCard.clearChildren();
                const price = formatNumToCoin(parseInt(response.data.both.price));
                new UIText(`${attributeName1} 1 & ${attributeName2} 1`)
                    .setX((10).pixels())
                    .setY((10).pixels())
                    .setChildOf(bothAuctionCard);
                new UIText(`Price: ${price} coins`)
                    .setX((10).pixels())
                    .setY((25).pixels())
                    .setChildOf(bothAuctionCard);
            } else {
                bothAuctionCard.clearChildren();
                new UIText('No data :(')
                    .setX(new CenterConstraint())
                    .setY(new CenterConstraint())
                    .setTextScale((2).pixels())
                    .setChildOf(bothAuctionCard);
            }
        }
    });
}

register('renderOverlay', () => {
    if (lbKey.isPressed()
        && Player.getHeldItem()
        && Player.getHeldItem()?.getNBT()?.get('tag')?.get('ExtraAttributes')?.get('attributes')?.toObject()
    ) {
        createAuctionGui(Player.getHeldItem());
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

register('guiKey', (c, k, g) => {
    if (g.class.getTypeName() === 'net.minecraft.client.gui.inventory.GuiInventory'
        || g.class.getTypeName() === 'net.minecraft.client.gui.inventory.GuiChest'
    )
        if (k === lbKey.getKeyCode()) {
            const item = Client.currentGui.getSlotUnderMouse()?.getItem();
            if (item && item.getNBT()?.get('tag')?.get('ExtraAttributes')?.get('attributes')?.toObject()) {
                createAuctionGui(item);
                guiOpen = true;
            }
        }
})