const lbKey = new KeyBind('View Lowest bin with attribute considered', Keyboard.KEY_K, 'TakeshiAddons');

import { CenterConstraint, UIBlock, UIContainer, UIRoundedRectangle, UIText, Window } from '../../../Elementa';
import getItemId from '../../utils/item_id';
import { SkyblockAttributes } from '../../data/attributes';
import getArmorType from '../../utils/armor_type';
import formatNumToCoin from '../../utils/format_coin';
import { getPriceData } from '../../utils/auction';
const Color = Java.type('java.awt.Color');
const UIItem = (item) => {
    return new JavaAdapter(UIBlock, {
        draw: function () {
            item.draw(this.getLeft(), this.getTop(), this.getHeight() / 16);
        }
    });
}

let guiOpen = false;

const cardWidth = 200;
const cardHeight = 150;
const cardSpace = 10;
const cardY = 35;

const gui = new Gui();
const window = new Window();

const createLowestBINCard = (parentCard, auctionData, attributeName, attributeLevel, armorType, itemName) => {
    if (!auctionData.original && !auctionData.type) {
        new UIText('No data :(')
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((2).pixels())
            .setChildOf(parentCard);
    } else {
        if (auctionData.type) {
            const price = formatNumToCoin(parseInt(auctionData.type.price));
            new UIText(`${armorType} with ${attributeName} ${attributeLevel}`)
                .setX((10).pixels())
                .setY((10).pixels())
                .setChildOf(parentCard);
            new UIText(`Price: ${price} coins`)
                .setX((10).pixels())
                .setY((25).pixels())
                .setChildOf(parentCard);
            let currentY = 35;
            auctionData.type.attributes.forEach((a) => {
                new UIText(`${a.name} ${a.value}`)
                    .setX((20).pixels())
                    .setY(currentY.pixels())
                    .setChildOf(parentCard);
                currentY += 10;
            });
        }
        if (auctionData.original) {
            const price = formatNumToCoin(parseInt(auctionData.original.price));
            new UIText(`${itemName} ${attributeName} ${attributeLevel}`)
                .setX((10).pixels())
                .setY((60).pixels())
                .setChildOf(parentCard);
            new UIText(`Price: ${price} coins`)
                .setX((10).pixels())
                .setY((75).pixels())
                .setChildOf(parentCard);
            let currentY = 85;
            auctionData.original.attributes.forEach((a) => {
                new UIText(`${a.name} ${a.value}`)
                    .setX((20).pixels())
                    .setY(currentY.pixels())
                    .setChildOf(parentCard);
                currentY += 10;
            });
        }
    }
}

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

    const armorType = getArmorType(itemId);
    const [attributeId1, attributeId2] = Object.keys(attributes);
    const [attributeLevel1, attributeLevel2] = [attributes[attributeId1], attributes[attributeId2]];
    let attributeName1 = '', attributeName2 = '';
    SkyblockAttributes.forEach((a) => {
        if (a.id === attributeId1) attributeName1 = a.name;
        if (a.id === attributeId2) attributeName2 = a.name;
    });

    let attributeSearchQuery = [{
        id: attributeId1,
        value: attributeLevel1
    }];
    if (attributeId2) {
        attributeSearchQuery.push({
            id: attributeId2,
            value: attributeLevel2
        });
    }
    const results = getPriceData(itemId, armorType !== 'Unknown', attributeSearchQuery);
    onlyFirstAuctionCard.clearChildren();
    onlySecondAuctionCard.clearChildren();
    bothAuctionCard.clearChildren();
    // if (armorType !== 'Unknown') {
    // armor
    createLowestBINCard(onlyFirstAuctionCard,
        { original: results[1][attributeId1][0], type: results[0][attributeId1][0] },
        attributeName1,
        attributeLevel1,
        armorType,
        item.getName()
    );
    if (attributeId2) {
        createLowestBINCard(onlySecondAuctionCard,
            { original: results[1][attributeId2][0], type: results[0][attributeId2][0] },
            attributeName2,
            attributeLevel2,
            armorType,
            item.getName()
        );
        if (results[1]['both'].length !== 0) {
            const price = formatNumToCoin(parseInt(results[1]['both'][0]['price']));
            new UIText(`${attributeName1} 1 & ${attributeName2} 1`)
                .setX((10).pixels())
                .setY((10).pixels())
                .setChildOf(bothAuctionCard);
            new UIText(`Price: ${price} coins`)
                .setX((10).pixels())
                .setY((25).pixels())
                .setChildOf(bothAuctionCard);
        } else {
            new UIText('No data :(')
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((2).pixels())
                .setChildOf(bothAuctionCard);
        }
    }
    // }

    /*
    let url = `https://skyblock-hono-production.up.railway.app/lb?itemId=${itemId}&attributeId1=${attributeId1}&attributeLevel1=${attributeLevel1}`;
    if (attributeId2)
        url += `&attributeId2=${attributeId2}&attributeLevel2=${attributeLevel2}`;
    request({
        url: url
    }).then((res) => {
        const response = res.data;
        onlyFirstAuctionCard.clearChildren();
        onlySecondAuctionCard.clearChildren();
        bothAuctionCard.clearChildren();
        if (response.success === false) {
            new UIText('Error :(')
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((2).pixels())
                .setColor(new ConstantColorConstraint(Color.RED))
                .setChildOf(onlyFirstAuctionCard);
        } else {
            createLowestBINCard(onlyFirstAuctionCard, response.data.first, attributeName1, attributeLevel1, armorType, item.getName());
            createLowestBINCard(onlySecondAuctionCard, response.data.second, attributeName2, attributeLevel2, armorType, item.getName());

            if (response.data.both) {
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
                new UIText('No data :(')
                    .setX(new CenterConstraint())
                    .setY(new CenterConstraint())
                    .setTextScale((2).pixels())
                    .setChildOf(bothAuctionCard);
            }
        }
    });
    */
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