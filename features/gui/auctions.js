import { request } from '../../../axios';
import {
    AdditiveConstraint,
    Animations,
    CenterConstraint,
    ChildBasedMaxSizeConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    FillConstraint,
    ScrollComponent,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UIContainer,
    UIRoundedRectangle,
    UIText,
    WindowScreen,
    animate
} from '../../../Elementa';
import { getHour } from "../../utils/time";
import formatNumToCoin from "../../utils/format_coin";
import { getPriceData } from '../../utils/auction';
const Color = Java.type('java.awt.Color');
const Toolkit = Java.type('java.awt.Toolkit');
const StringSelection = Java.type('java.awt.datatransfer.StringSelection');
const EssentialAPI = Java.type('gg.essential.api.EssentialAPI');
const EssentialNotifications = EssentialAPI.getNotifications();

let itemId = '';
let attributeId1 = '';
let attributeLevel1 = '';
let attributeId2 = '';
let attributeLevel2 = '';

const cardWidth = 200;
const cardHeight = 150;

export const openAuctionView = (itemId, attributeId1, attributeLevel1, attributeId2, attributeLevel2) => {
    itemId = itemId;
    attributeId1 = attributeId1;
    attributeLevel1 = attributeLevel1;
    attributeId2 = attributeId2;
    attributeLevel2 = attributeLevel2;
    AuctionView.init();
    GuiHandler.openGui(AuctionView);
}

const createAuctionCard = (auctionData) => {
    const uuid = auctionData.uuid;
    const name = auctionData.itemNameWithFormat;
    // const id = auctionData.itemId;
    const endUnix = auctionData.end;
    const price = formatNumToCoin(auctionData.price);
    const attributes = auctionData.attributes

    const cardWidth = 200;
    const cardHeight = 150;

    const card = new UIRoundedRectangle(2.0)
        .setWidth(cardWidth.pixels())
        .setHeight(cardHeight.pixels())
        .setColor(Color.GRAY)
        .onMouseClick(() => {
            copyButton.grabWindowFocus();
        });

    const textContainer = new UIContainer()
        .setX((2).pixels())
        .setY((2).pixels())
        .setWidth(new SubtractiveConstraint((100).percent(), (4).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (4).pixels()))
        .setChildOf(card);

    new UIText(name, false)
        .setX((0).pixels())
        .setY((0).pixels())
        .setTextScale((1.5).pixels())
        .setChildOf(textContainer);

    new UIText(`Price: ${price} coins`, false)
        .setX((2).pixels())
        .setY(new AdditiveConstraint(new SiblingConstraint(), (1).pixels()))
        .setChildOf(textContainer);

    new UIText(`Ends in: ${getHour(endUnix - Date.now())} hours`, false)
        .setX((2).pixels())
        .setY(new AdditiveConstraint(new SiblingConstraint(), (1).pixels()))
        .setChildOf(textContainer);

    if (attributes) {
        new UIText('Attributes: ', false)
            .setX((2).pixels())
            .setY(new AdditiveConstraint(new SiblingConstraint(), (1).pixels()))
            .setChildOf(textContainer);
        attributes.forEach((attribute) => {
            new UIText(`${attribute.name} ${attribute.value}`, false)
                .setX((4).pixels())
                .setY(new AdditiveConstraint(new SiblingConstraint(), (1).pixels()))
                .setChildOf(textContainer);
        });
    }

    const copyButton = new UIBlock(new Color(207 / 255, 207 / 255, 196 / 255))
        .setX((2).pixels(true))
        .setY((2).pixels(true))
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (2).pixels()))
        .setHeight(new AdditiveConstraint(new ChildBasedSizeConstraint(), (2).pixels()))
        .onMouseClick(() => {
            const selection = new StringSelection(`/viewauction ${uuid}`);
            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(selection, null);
            EssentialNotifications.push('Command copied!', 'Viewauction command was copied to your clipboard', 3);
        })
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(new Color(120 / 255, 120 / 255, 100 / 255))
                );
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255))
                );
            });
        })
        .setChildOf(card);

    new UIText('Copy command', false)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(copyButton);

    return card;
}

const createListPane = (window, auctionList) => {
    const pane = new ScrollComponent()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((100).percent())
        .setHeight((100).percent())
        .setChildOf(window);

    let currentY = 0;
    auctionList.forEach((auction, index) => {
        const x = pane.getWidth() - cardWidth * 4 > 0 ?
            (pane.getWidth() - cardWidth * 4) * ((index % 4) + 1) + cardWidth * (index % 4) :
            (pane.getWidth() - cardWidth * 3 > 0 ?
                (pane.getWidth() - cardWidth * 3) * ((index % 3) + 1) + cardWidth * (index % 3) :
                (pane.getWidth() - cardWidth * 2 > 0 ?
                    (pane.getWidth() - cardWidth * 2) * ((index % 2) + 1) + cardWidth * (index % 2) :
                    pane.getWidth() - cardWidth * 2
                )
            );
        const card = new UIRoundedRectangle(3)
            .setX(x.pixels())
            .setY(currentY.pixels())
            .setWidth(cardWidth)
            .setHeight(cardHeight)
            .setChildOf(pane)
    })

    return pane;
}

export const AuctionView = new JavaAdapter(WindowScreen, {
    init() {
        this.getWindow().clearChildren();
        const background = new UIRoundedRectangle(5)
            .setX((Renderer.screen.getWidth() * 0.2).pixels())
            .setY((Renderer.screen.getHeight() * 0.2).pixels())
            .setWidth((Renderer.screen.getWidth() * 0.6).pixels())
            .setHeight((Renderer.screen.getHeight() * 0.6).pixels())
            .setColor(new Color(40 / 255, 40 / 255, 40 / 255, 1))
            .setChildOf(this.getWindow());

        let isArmor = false;
        if (itemId.includes('HELMET') ||
            itemId.includes('CHESTPLATE') ||
            itemId.includes('LEGGINGS') ||
            itemId.includes('BOOTS')
        ) {
            isArmor = true;
        }
        let atQuery = [{
            id: attributeId1,
            value: attributeLevel1 ? attributeLevel1 : 1
        }];
        if (attributeId2) {
            atQuery.push({
                id: attributeId2,
                value: attributeLevel2 ? attributeLevel2 : 1
            })
        }
        const priceData = getPriceData(itemId, isArmor, atQuery);
        let url = `https://skyblock-hono-production.up.railway.app/auctions?itemId=${itemId}`;
        if (attributeId1) url += `&attributeId1=${attributeId1}&attributeLevel1=${attributeLevel1}`;
        if (attributeId2) url += `&attributeId2=${attributeId2}&attributeLevel2=${attributeLevel2}`;
        request({
            url: url
        }).then((res) => {
            const response = res.data;
            if (response.success === false) {
                console.log(url);
                console.dir(response, { depth: null });
                new UIText('Error :(')
                    .setX(new CenterConstraint())
                    .setY(new CenterConstraint())
                    .setTextScale((2).pixels())
                    .setColor(new ConstantColorConstraint(Color.RED))
                    .setChildOf(container);
            } else {
                console.log(`got ${response.data.length} auctions`);
                const scroll = new ScrollComponent()
                    .setX((0).pixels())
                    .setY((0).pixels())
                    .setWidth(new FillConstraint())
                    .setHeight(new FillConstraint())
                    .setChildOf(container);
                const rows = []
                response.data.forEach((auctionData, i) => {
                    if (i % 4 === 0) {
                        rows.push(new UIContainer()
                            .setX((50).pixels())
                            .setY(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
                            .setWidth(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (10).pixels()))
                            .setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (10).pixels()))
                            .setChildOf(scroll));
                        console.log(i);
                    }
                    createAuctionCard(auctionData)
                        .setX(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
                        .setY((5).pixels())
                        .setChildOf(rows[(i - i % 4) / 4]);
                });
            }
        });
    }
})

register('command', (...args) => {
    itemId = args[0];
    attributeId1 = args[1];
    attributeLevel1 = args[2];
    attributeId2 = args[3];
    attributeLevel2 = args[4];
    AuctionView.init();
    GuiHandler.openGui(AuctionView);
}).setCommandName('openaucview');