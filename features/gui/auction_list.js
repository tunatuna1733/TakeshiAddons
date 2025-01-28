import {
  Animations,
  CenterConstraint,
  ConstantColorConstraint,
  ScrollComponent,
  UIBlock,
  UIRoundedRectangle,
  UIText,
  WindowScreen,
  animate,
} from '../../../Elementa';
import { checkExactAttribute, getSingleAttributeAuctions } from '../../utils/auction';

const Color = Java.type('java.awt.Color');

const backgroundColor = new Color(40 / 255, 40 / 255, 40 / 255, 1);
const selectedBackgroundColor = new Color(60 / 255, 60 / 255, 60 / 255, 1);
const selectedBlurBackgroundColor = new Color(80 / 255, 80 / 255, 80 / 255, 1);

const xOffset = 20; // %
const yOffset = 10; // %

/*
  'Armor',
  'Molten',
  'Crimson',
  'Magmalord',
  'Rods',
  'Shards',
*/
const types = ['Armor', 'Molten', 'Crimson', 'Magmalord', 'Rods', 'Shards'];
let selectedType = 'Armor';
let selectedLevel = '1';

let itemId = '';
let attributeId1 = '';
let attributeLevel1 = '1';
// let attributeId2 = '';
// let attributeLevel2 = '1';

let firstAttributeAuctions;
// let secondAttributeAuctions = [];
let auctions = [];

class TabButton {
  /**
   *
   * @param {any} parent Parent Window
   * @param {string} text Button text
   * @param {boolean} isLevel Whether its level or not
   */
  constructor(parent, text, isLevel) {
    this.text = text;
    this.isLevel = isLevel; // level or type

    this.element = new UIBlock()
      .setColor(backgroundColor)
      .onMouseClick((_, __) => {
        if (isLevel) selectedLevel = this.text;
        else selectedType = this.text;
      })
      .onMouseEnter((comp, _) => {
        animate(comp, (animation) => {
          animation.setColorAnimation(
            Animations.OUT_EXP,
            0.5,
            new ConstantColorConstraint(this._isSelected() ? selectedBlurBackgroundColor : selectedBackgroundColor),
            0,
          );
        });
      })
      .onMouseLeave((comp, _) => {
        animate(comp, (animation) => {
          animation.setColorAnimation(
            Animations.OUT_EXP,
            0.5,
            new ConstantColorConstraint(this._isSelected() ? selectedBackgroundColor : backgroundColor),
            0,
          );
        });
      })
      .setChildOf(parent);

    new UIText(this.text).setX(new CenterConstraint()).setY(new CenterConstraint()).setChildOf(this.element);
  }

  _isSelected = () => {
    if (this.isLevel) {
      return this.text === selectedLevel;
    } else {
      return this.text === selectedType;
    }
  };

  setCoords = (x, y) => {
    this.element.setX(x.pixels()).setY(y.pixels());
    return this;
  };

  setSize = (width, height) => {
    this.element.setWidth(width.pixels()).setHeight(height.pixels());
    return this;
  };

  reload = () => {
    if (this._isSelected()) {
      this.element.setColor(new ConstantColorConstraint(selectedBackgroundColor));
    } else {
      this.element.setColor(new ConstantColorConstraint(backgroundColor));
    }
  };
}

class AuctionItem {
  constructor(scroll, auction) {
    this.auction = auction;

    this.element = new UIRoundedRectangle(3)
      .onMouseClick((_, __) => {
        Client.currentGui.close();
        ChatLib.command(`viewauction ${this.auction.uuid}`);
      })
      .setColor(selectedBackgroundColor)
      .onMouseEnter((comp, _) => {
        animate(comp, (animation) => {
          animation.setColorAnimation(
            Animations.OUT_EXP,
            0.5,
            new ConstantColorConstraint(selectedBlurBackgroundColor),
            0,
          );
        });
      })
      .onMouseLeave((comp, _) => {
        animate(comp, (animation) => {
          animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(selectedBackgroundColor), 0);
        });
      })
      .setChildOf(scroll);

    const itemName =
      'itemNameWithFormat' in auction ? auction.itemNameWithFormat : getRarityPrefix(auction.tier) + auction.itemName;
    const priceText = `${formatNumToCoin(auction.price)} coins`;

    new UIText(itemName).setX((5).percent()).setY((5).percent()).setChildOf(this.element);

    if ('attributes' in auction) {
      auction.attributes.forEach((attribute) => {
        new UIText(`${attribute.name} ${attribute.value}`)
          .setX((10).pixels())
          .setY(new SiblingConstraint())
          .setChildOf(this.element);
      });
    }

    new UIText(priceText)
      .setX((10).percent())
      .setY(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
      .setColor(Color.YELLOW)
      .setChildOf(this.element);
  }

  setCoords = (x, y) => {
    this.element.setX(x.pixels()).setY(y.pixels());
    return this;
  };

  setSize = (width, height) => {
    this.element.setWidth(width.pixels()).setHeight(height.pixels());
    return this;
  };
}

export const AuctionView = new JavaAdapter(WindowScreen, {
  init() {
    this.getWindow().clearChildren();
    const containerWidth = Renderer.screen.getWidth() * 0.8;
    const containerHeight = Renderer.screen.getHeight() * 0.8;
    const containerXOffset = (containerWidth * xOffset) / 100;
    const containerYOffset = (containerHeight * yOffset) / 100;
    const scrollWidth = containerWidth - containerXOffset;

    const numOfCardsInARow = 4;

    const cardWidth = scrollWidth / (numOfCardsInARow + 1);
    const cardHeight = cardWidth * 0.8;
    const cardInterval = (scrollWidth - cardWidth * numOfCardsInARow) / 5;

    let levelTabs = [];
    let typeTabs = [];

    const generateLevelTabs = () => {
      levelTabs = [];
      const numOfLevels = selectedType === 'Shards' ? 3 : 10;
      const levelTabWidth = scrollWidth / numOfLevels;
      const levelTabHeight = containerYOffset;

      for (let i = 1; i <= numOfLevels; i++) {
        let tab = new TabButton(background, `${i}`, true)
          .setSize(levelTabWidth, levelTabHeight)
          .setCoords(containerXOffset + levelTabWidth * (i - 1), 0);
        levelTabs.push(tab);
      }
    };

    const generateTypeTabs = () => {
      typeTabs = [];
      const numOfTypes = types.length;
      const typeTabWidth = containerXOffset;
      const typeTabHeight = (containerHeight - containerYOffset) / numOfTypes;

      types.forEach((t, i) => {
        let tab = new TabButton(background, t, false)
          .setSize(typeTabWidth, typeTabHeight)
          .setCoords(0, containerYOffset + typeTabHeight * i);
        typeTabs.push(tab);
      });
    };

    firstAttributeAuctions = getSingleAttributeAuctions(attributeId1);
    // secondAttributeAuctions = getSingleAttributeAuctions(attributeId2);

    const filterAuctions = (listElement) => {
      auctions = firstAttributeAuctions[selectedType.toLowerCase()].filter((a) =>
        checkExactAttribute(a, attributeId1, attributeLevel1),
      );
      auctions.forEach((auction, i) => {
        const x = cardInterval + (cardInterval + cardWidth) * (i % numOfCardsInARow);
        const y = cardInterval + (cardInterval + cardHeight) * Math.trunc(i / numOfCardsInARow);
        const _item = new AuctionItem(listElement, auction).setSize(cardWidth, cardHeight).setCoords(x, y);
      });
    };

    const background = new UIRoundedRectangle(5)
      .setX((Renderer.screen.getWidth() * 0.1).pixels())
      .setY((Renderer.screen.getHeight() * 0.1).pixels())
      .setWidth(containerWidth.pixels())
      .setHeight(containerHeight.pixels())
      .setColor(backgroundColor)
      .onMouseClick((_, __) => {
        generateLevelTabs();
        filterAuctions();
        levelTabs.forEach((l) => l.reload());
        typeTabs.forEach((t) => t.reload());
      })
      .setChildOf(this.getWindow());

    generateLevelTabs();
    generateTypeTabs();

    levelTabs.forEach((l) => l.reload());
    typeTabs.forEach((t) => t.reload());

    const auctionList = new ScrollComponent()
      .setX(containerXOffset.pixels())
      .setY(containerYOffset.pixels())
      .setWidth(scrollWidth.pixels())
      .setHeight((containerHeight - containerYOffset).pixels())
      .setChildOf(background);

    filterAuctions(auctionList);
  },
});

register('command', (...args) => {
  if (args[0]) itemId = args[0];
  if (args[1]) attributeId1 = args[1];
  if (args[2]) attributeLevel1 = args[2];
  // if (args[3]) attributeId2 = args[3];
  // if (args[4]) attributeLevel2 = args[4];
  AuctionView.init();
  GuiHandler.openGui(AuctionView);
}).setCommandName('opendebugauc');
