import {
  AdditiveConstraint,
  Animations,
  CenterConstraint,
  ChildBasedSizeConstraint,
  ConstantColorConstraint,
  ScrollComponent,
  SiblingConstraint,
  SubtractiveConstraint,
  UIBlock,
  UIContainer,
  UIRoundedRectangle,
  UIText,
  WindowScreen,
  animate,
} from '../../../Elementa';
import { getHour } from '../../utils/time';
import formatNumToCoin from '../../utils/format_coin';
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

const cardWidth = 150;
const cardHeight = 100;

export const openAuctionView = (
  itemId,
  attributeId1,
  attributeLevel1,
  attributeId2,
  attributeLevel2
) => {
  itemId = itemId;
  attributeId1 = attributeId1;
  attributeLevel1 = attributeLevel1;
  attributeId2 = attributeId2;
  attributeLevel2 = attributeLevel2;
  AuctionView.init();
  GuiHandler.openGui(AuctionView);
};

const createAuctionCard = (auctionData) => {
  const uuid = auctionData.uuid;
  const name = auctionData.itemNameWithFormat;
  // const id = auctionData.itemId;
  const endUnix = auctionData.end;
  const price = formatNumToCoin(auctionData.price);
  const attributes = auctionData.attributes;

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
    .setWidth(
      new AdditiveConstraint(new ChildBasedSizeConstraint(), (2).pixels())
    )
    .setHeight(
      new AdditiveConstraint(new ChildBasedSizeConstraint(), (2).pixels())
    )
    .onMouseClick(() => {
      const selection = new StringSelection(`/viewauction ${uuid}`);
      Toolkit.getDefaultToolkit()
        .getSystemClipboard()
        .setContents(selection, null);
      EssentialNotifications.push(
        'Command copied!',
        'Viewauction command was copied to your clipboard',
        3
      );
    })
    .onMouseEnter((comp) => {
      animate(comp, (animation) => {
        animation.setColorAnimation(
          Animations.OUT_EXP,
          0.5,
          new ConstantColorConstraint(
            new Color(120 / 255, 120 / 255, 100 / 255)
          )
        );
      });
    })
    .onMouseLeave((comp) => {
      animate(comp, (animation) => {
        animation.setColorAnimation(
          Animations.OUT_EXP,
          0.5,
          new ConstantColorConstraint(
            new Color(207 / 255, 207 / 255, 196 / 255)
          )
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
};

const getRarityPrefix = (rarity) => {
  let prefix = '&r';
  switch (rarity) {
    case 'COMMON':
      prefix = '&f';
      break;
    case 'UNCOMMON':
      prefix = '&a';
      break;
    case 'RARE':
      prefix = '&9';
      break;
    case 'EPIC':
      prefix = '&5';
      break;
    case 'LEGENDARY':
      prefix = '&6';
      break;
    case 'MYTHIC':
      prefix = '&d';
      break;
    case 'SPECIAL':
      prefix = '&c';
      break;
    case 'VERY SPECIAL':
      prefix = '&4';
      break;
    default:
      break;
  }
  return prefix;
};

const createListPane = (window, auctionList) => {
  const pane = new ScrollComponent()
    .setX((0).pixels())
    .setY((0).pixels())
    .setWidth((100).percent())
    .setHeight((100).percent())
    .setChildOf(window);

  let horizontalCount = 1;
  if (pane.getWidth() - cardWidth * 4 > 0) {
    horizontalCount = 4;
  } else if (pane.getWidth() - cardWidth * 3 > 0) {
    horizontalCount = 3;
  } else if (pane.getWidth() - cardWidth * 2 > 0) {
    horizontalCount = 2;
  }
  const interval =
    (pane.getWidth() - cardWidth * horizontalCount) / (horizontalCount + 1);
  let currentY = interval;
  auctionList.forEach((auction, index) => {
    const x =
      interval * ((index % horizontalCount) + 1) +
      cardWidth * (index % horizontalCount);
    const itemName =
      'itemNameWithFormat' in auction
        ? auction.itemNameWithFormat
        : getRarityPrefix(auction.tier) + auction.itemName;
    const priceText = formatNumToCoin(auction.price) + ' coins';

    const card = new UIRoundedRectangle(3)
      .setX(x.pixels())
      .setY(currentY.pixels())
      .setWidth(cardWidth.pixels())
      .setHeight(cardHeight.pixels())
      .setColor(
        new ConstantColorConstraint(new Color(70 / 255, 70 / 255, 70 / 255))
      )
      .onMouseClick(() => {
        const selection = new StringSelection(`/viewauction ${auction.uuid}`);
        Toolkit.getDefaultToolkit()
          .getSystemClipboard()
          .setContents(selection, null);
        EssentialNotifications.push(
          'Command copied!',
          'Viewauction command was copied to your clipboard',
          3
        );
      })
      .onMouseEnter((comp) => {
        animate(comp, (animation) => {
          animation.setColorAnimation(
            Animations.OUT_EXP,
            0.5,
            new ConstantColorConstraint(
              new Color(100 / 255, 100 / 255, 100 / 255)
            )
          );
        });
      })
      .onMouseLeave((comp) => {
        animate(comp, (animation) => {
          animation.setColorAnimation(
            Animations.OUT_EXP,
            0.5,
            new ConstantColorConstraint(new Color(70 / 255, 70 / 255, 70 / 255))
          );
        });
      })
      .setChildOf(pane);

    new UIText(itemName)
      .setX((5).percent())
      .setY((5).percent())
      .setChildOf(card);

    if ('attributes' in auction) {
      auction.attributes.forEach((attribute) => {
        new UIText(`${attribute.name} ${attribute.value}`)
          .setX((10).pixels())
          .setY(new SiblingConstraint())
          .setChildOf(card);
      });
    }

    new UIText(priceText)
      .setX((10).percent())
      .setY(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
      .setColor(Color.YELLOW)
      .setChildOf(card);

    if (index % horizontalCount === horizontalCount - 1)
      currentY += cardHeight + interval;
  });

  return pane;
};

export const AuctionView = new JavaAdapter(WindowScreen, {
  init() {
    this.getWindow().clearChildren();
    const background = new UIRoundedRectangle(5)
      .setX((Renderer.screen.getWidth() * 0.1).pixels())
      .setY((Renderer.screen.getHeight() * 0.1).pixels())
      .setWidth((Renderer.screen.getWidth() * 0.8).pixels())
      .setHeight((Renderer.screen.getHeight() * 0.8).pixels())
      .setColor(new Color(40 / 255, 40 / 255, 40 / 255, 1))
      .setChildOf(this.getWindow());

    let isArmor = false;
    if (
      itemId.includes('HELMET') ||
      itemId.includes('CHESTPLATE') ||
      itemId.includes('LEGGINGS') ||
      itemId.includes('BOOTS')
    ) {
      isArmor = true;
    }
    let atQuery = [
      {
        id: attributeId1,
        value: attributeLevel1 ? attributeLevel1 : 1,
      },
    ];
    if (attributeId2) {
      atQuery.push({
        id: attributeId2,
        value: attributeLevel2 ? attributeLevel2 : 1,
      });
    }
    const priceData = getPriceData(itemId, isArmor, atQuery);
    if (isArmor) {
      createListPane(background, priceData[0][attributeId1]);
    } else {
      createListPane(background, priceData[attributeId1]);
    }
    /*
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
        */
  },
});

register('command', (...args) => {
  itemId = args[0];
  attributeId1 = args[1];
  attributeLevel1 = args[2];
  attributeId2 = args[3];
  attributeLevel2 = args[4];
  AuctionView.init();
  GuiHandler.openGui(AuctionView);
}).setCommandName('openaucview');
