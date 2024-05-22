import {
    Animations,
    CenterConstraint,
    ConstantColorConstraint,
    ScissorEffect,
    ScrollComponent,
    StencilEffect,
    UIBlock,
    UIContainer,
    UIRoundedRectangle,
    UIText,
    WindowScreen,
    animate
} from "../../../Elementa";
import { CHAT_PREFIX } from "../../data/chat";

const Color = Java.type('java.awt.Color');

const backgroundColor = new Color(40 / 255, 40 / 255, 40 / 255, 1);
const selectedBackgroundColor = new Color(60 / 255, 60 / 255, 60 / 255, 1);
const selectedBlurBackgroundColor = new Color(80 / 255, 80 / 255, 80 / 255, 1)

let selectedOption = '';
let selectedLevel = 1;
let attributeId1 = '', attributeId2 = '';

class TabButton {
    constructor(parent, text) {
        this.text = text;

        this.element = new UIBlock()
            .setColor(backgroundColor)
            .onMouseClick((_, __) => {
                selectedOption = this.text;
            })
            .onMouseEnter((comp, _) => {
                if (!this._isSelected()) {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(selectedBackgroundColor),
                            0
                        );
                    });
                } else {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(selectedBlurBackgroundColor),
                            0
                        );
                    });
                }
            })
            .onMouseLeave((comp, _) => {
                if (!this._isSelected()) {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(backgroundColor),
                            0
                        );
                    });
                } else {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(selectedBackgroundColor),
                            0
                        );
                    });
                }
            })
            .setChildOf(parent);

        new UIText(this.text)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.element);
    }

    _isSelected = () => {
        return this.text === selectedOption;
    }

    setCoords = (x, y) => {
        this.element.setX(x.pixels())
            .setY(y.pixels());
        return this;
    }

    setSize = (width, height) => {
        this.element.setWidth(width.pixels())
            .setHeight(height.pixels());
        return this;
    }

    reload = () => {
        if (this._isSelected()) {
            this.element.setColor(new ConstantColorConstraint(selectedBackgroundColor));
        } else {
            this.element.setColor(new ConstantColorConstraint(backgroundColor));
        }
    }
}

class LevelTabButton {
    constructor(parent, text) {
        this.text = text;

        this.element = new UIBlock()
            .setColor(backgroundColor)
            .onMouseClick((_, __) => {
                selectedLevel = this.text;
            })
            .onMouseEnter((comp, _) => {
                if (!this._isSelected()) {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(selectedBackgroundColor),
                            0
                        );
                    });
                } else {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(selectedBlurBackgroundColor),
                            0
                        );
                    });
                }
            })
            .onMouseLeave((comp, _) => {
                if (!this._isSelected()) {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(backgroundColor),
                            0
                        );
                    });
                } else {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(selectedBackgroundColor),
                            0
                        );
                    });
                }
            })
            .setChildOf(parent);

        new UIText(this.text.toString())
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.element);
    }

    _isSelected = () => {
        return this.text === selectedLevel;
    }

    setCoords = (x, y) => {
        this.element.setX(x.pixels())
            .setY(y.pixels());
        return this;
    }

    setSize = (width, height) => {
        this.element.setWidth(width.pixels())
            .setHeight(height.pixels());
        return this;
    }

    reload = () => {
        if (this._isSelected()) {
            this.element.setColor(new ConstantColorConstraint(selectedBackgroundColor));
        } else {
            this.element.setColor(new ConstantColorConstraint(backgroundColor));
        }
    }
}

class AuctionList {
    constructor(parent, title, level, auctions) {
        this.title = title;
        this.level = level;

        this.scrollElement = new ScrollComponent()
            .setX((0).pixels())
            .setY((0).pixels())
            .setWidth((100).percent())
            .setHeight((100).percent())
            .setChildOf(parent);

        const width = this.scrollElement.getWidth();
        const height = this.scrollElement.getHeight();

        const rowWidth = 3;
        const cardWidth = width * 0.8 / rowWidth;
        const cardHeight = cardWidth * 0.7;
        const interval = (width - cardWidth * rowWidth) / 4;
        let currentY = interval;

        auctions.forEach((auction, index) => {
            const countInRow = index % rowWidth;
            const currentX = (countInRow + 1) * interval + countInRow * cardWidth;

            const card = new UIRoundedRectangle(3)
                .setX(currentX.pixels())
                .setY(currentY.pixels())
                .setWidth(cardWidth.pixels())
                .setHeight(cardHeight.pixels())
                .setColor(new ConstantColorConstraint(new Color(70 / 255, 70 / 255, 70 / 255)))
                .onMouseClick(() => {
                    const selection = new StringSelection(`/viewauction ${auction.uuid}`);
                    Toolkit.getDefaultToolkit().getSystemClipboard().setContents(selection, null);
                    EssentialNotifications.push('Command copied!', 'Viewauction command was copied to your clipboard', 3);
                })
                .onMouseEnter((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations.OUT_EXP,
                            0.5,
                            new ConstantColorConstraint(new Color(100 / 255, 100 / 255, 100 / 255))
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
                .setChildOf(this.scrollElement);

            new UIText(itemName)
                .setX((5).percent())
                .setY((5).percent())
                .setChildOf(card);

            if ('attributes' in auction) {
                auction.attributes.forEach(attribute => {
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

            if (index % rowWidth === rowWidth - 1)
                currentY += (cardHeight + interval);
        })
    }
}

// main container which means the ui without top tabs
class AuctionPane {
    constructor(parent, title) {
        this.title = title;
        this.element = new UIContainer()
            .setX((0).pixels())
            .setY((0).pixels())
            .setWidth((100).percent())
            .setHeight((100).percent())
            .onMouseClick((_, __) => {
                tabs.forEach(t => t.reload());
                ChatLib.chat(tabLevels.length);
            })
            .setChildOf(parent);


        const width = this.element.getWidth();
        const height = this.element.getHeight();

        this.listElement = new UIContainer()
            .setX((width * 0.1).pixels())
            .setY((0).pixels())
            .setWidth((width * 0.9).pixels())
            .setHeight((100).percent())
            .setChildOf(this.element);

        const tabLevels = this.title === 'Shards' ? [1, 2, 3] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const tabs = [];
        tabLevels.forEach((level, i) => {
            tabs.push(
                new LevelTabButton(this.element, level)
                    .setCoords(0, height / tabLevels.length * i)
                    .setSize(width * 0.1, height / tabLevels.length)
            );
        });
    }

    reload = () => {
        this.listElement.removeChildren();
        const auctions = [];   // make this const with '?' operator
        // request using title
        new AuctionList(this.listElement, this.title, selectedLevel, auctions);
    }
}

const createAttributePriceGui = (window) => {
    const screenWidth = Renderer.screen.getWidth();
    const screenHeight = Renderer.screen.getHeight();
    const width = screenWidth * 0.6;
    const height = screenHeight * 0.6;
    window.clearChildren();
    const background = new UIRoundedRectangle(5)
        .setX((screenWidth * 0.2).pixels())
        .setY((screenHeight * 0.2).pixels())
        .setWidth(width.pixels())
        .setHeight(height.pixels())
        .setColor(backgroundColor)
        .onMouseClick((_, __) => {
            tabs.forEach(t => t.reload());
            ChatLib.chat(`${selectedOption}, ${selectedLevel}`);
        })
        .enableEffect(new StencilEffect())
        .setChildOf(window);

    const listArea = new UIContainer()
        .setX((0).pixels())
        .setY((10).percent())
        .setWidth((100).percent())
        .setHeight((90).percent())
        .setChildOf(background);

    const tabTexts = [
        'Armor',
        'Molten',
        'Crimson',
        'Fishing Armor',
        'Rods',
        'Shards'
    ];

    const tabs = [];
    tabTexts.forEach((text, i) => {
        tabs.push(
            new TabButton(background, text)
                .setCoords(i * (1 / tabTexts.length) * width, 0)
                .setSize((1 / tabTexts.length) * width, height * 0.1)
        );
        new AuctionPane(listArea, text);
    });
}

const AttributePrice = new JavaAdapter(WindowScreen, {
    init() {
        createAttributePriceGui(this.getWindow());
    }
});

register('command', (args) => {
    if (!args) {
        if (attributeId1 === '') {
            ChatLib.chat(`${CHAT_PREFIX} &cPlease specify attributes!`);
            return;
        }
    } else {
        attributeId1 = '', attributeId2 = '';
        // set attribute ids here
    }
    AttributePrice.init();
    GuiHandler.openGui(AttributePrice);
}).setCommandName('ap');