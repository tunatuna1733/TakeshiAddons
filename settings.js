// @ts-ignore
import { m7NotRNGLootNames } from "./data/m7loot";
import { @Vigilant,
    @SwitchProperty,
    @TextProperty,
    @CheckboxProperty,
    @ButtonProperty,
    @SelectorProperty,
    @SliderProperty,
    @ColorProperty,
    @PercentSliderProperty,
    @DecimalSliderProperty,
    @NumberProperty,
    Color,
    createPropertyAttributesExt
} from "../Vigilance/index";
const Color = Java.type('java.awt.Color');
const PropertyData = Java.type("gg.essential.vigilance.data.PropertyData");
const PropertyType = Java.type("gg.essential.vigilance.data.PropertyType");
const ValueBackedPropertyValue = Java.type("gg.essential.vigilance.data.ValueBackedPropertyValue");

@Vigilant("TakeshiAddons", "§d§lTakeshiAddons", {
    getCategoryComparetor: () => (a, b) => {
        const categories = ["HUD", "Dungeon", "Kuudra", "Others", "Garden", "Crimson Isle"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    @ButtonProperty({
        name: 'Edit HUD location',
        description: 'Click to edit HUD locations',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'Edit location'
    })
    editGui() {
        ChatLib.command('takeshi movehud', true);
    }

    @SwitchProperty({
        name: 'Armor HUD',
        description: 'Armor HUD things',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    armorhud = false;

    @SwitchProperty({
        name: 'Equipment HUD',
        description: 'Equipment HUD things',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    equipmenthud = false;

    @SwitchProperty({
        name: 'Reforge HUD',
        description: 'Display selected accessory reforge',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    reforgehud = false;

    @SwitchProperty({
        name: 'Crimson Dominus HUD',
        description: 'Display current dominus stack',
        category: 'HUD',
        subcategory: 'Kuudra Armor HUD'
    })
    crimsonhud = false;

    @SwitchProperty({
        name: 'Terror Hydra Strike HUD',
        description: 'Display current hydra strike stack',
        category: 'HUD',
        subcategory: 'Kuudra Armor HUD'
    })
    terrorhud = false;

    @SwitchProperty({
        name: 'Ragnarock Axe Cooldown HUD',
        description: 'Display Ragnarock Axe cooldown',
        category: 'HUD',
        subcategory: 'RagAxe Cooldown'
    })
    raghud = false;

    @SwitchProperty({
        name: 'Ragnarock Axe hotbar only',
        description: 'Only show when Ragnarock Axe is in hotbar',
        category: 'HUD',
        subcategory: 'RagAxe Cooldown'
    })
    raghotbar = true;

    @SwitchProperty({
        name: 'Lifeline HUD',
        description: 'Display whether lifeline is active or not',
        category: 'HUD',
        subcategory: 'Lifeline Display'
    })
    lifelinehud = false;

    @SwitchProperty({
        name: 'Only show when in Kuudra\'s Hollow',
        description: 'Only show when you are in Kuudra\'s Hollow',
        category: 'HUD',
        subcategory: 'Lifeline Display'
    })
    lifelinekuudra = true;

    @SwitchProperty({
        name: 'Reaper Armor Cooldown HUD',
        description: 'Display Reaper Armor Cooldown',
        category: 'HUD',
        subcategory: 'Reaper Armor Cooldown'
    })
    reaperhud = false;

    @SwitchProperty({
        name: 'Only show with Ragnarock Axe',
        description: 'Only show when you have Ragnarock Axe in your inventory',
        category: 'HUD',
        subcategory: 'Reaper Armor Cooldown'
    })
    reaperrag = true;

    @SwitchProperty({
        name: 'Last Breath Hit Count HUD',
        description: 'Display how many times you hit with Last Breath (Shows when you have Last Breath in your inventory) (Sometimes inaccurate zzz)',
        category: 'HUD',
        subcategory: 'Last Breath HUD'
    })
    lbhud = false;

    @SwitchProperty({
        name: 'Last Breath hotbar only',
        description: 'Only show when Last Breath is in hotbar',
        category: 'HUD',
        subcategory: 'Last Breath HUD'
    })
    lbhotbar = true;

    @SliderProperty({
        name: 'Last Breath reset length',
        description: 'Specify the number of seconds which resets the hit count of the Last Breath since the first hit',
        min: 1,
        max: 30,
        category: 'HUD',
        subcategory: 'Last Breath HUD'
    })
    lbreset = 5;

    @SwitchProperty({
        name: 'Flare Timer',
        description: 'Display active flare timer',
        category: 'HUD',
        subcategory: 'Flare Timer'
    })
    flaretimer = false;

    @SwitchProperty({
        name: 'Kuudra Profit Display',
        description: 'Display estimated profit of Paid Chest in Kuudra considering attributes',
        category: 'Kuudra',
        subcategory: 'Kuudra Profit'
    })
    kuudraprofit = false;

    @SwitchProperty({
        name: 'M7 Terminal Waypoint',
        description: 'Display your terminal waypoints according to your class',
        category: 'Dungeon',
        subcategory: 'M7 Terminal'
    })
    terminalwaypoint = false;

    @ColorProperty({
        name: 'Terminal Waypoint Color',
        description: 'Change terminal waypoint color',
        category: 'Dungeon',
        subcategory: 'M7 Terminal'
    })
    terminalcolor = Color.RED;

    @SelectorProperty({
        name: 'First Terminal Class',
        description: 'Select which class should do the first terminals',
        category: 'Dungeon',
        subcategory: 'M7 Terminal',
        options: ['Tank', 'Mage', 'Berserk', 'Archer']
    })
    firstterminal = 0;

    @SelectorProperty({
        name: 'Second Terminal Class',
        description: 'Select which class should do the second terminals',
        category: 'Dungeon',
        subcategory: 'M7 Terminal',
        options: ['Tank', 'Mage', 'Berserk', 'Archer']
    })
    secondterminal = 1;

    @SelectorProperty({
        name: 'Third Terminal Class',
        description: 'Select which class should do the third terminals',
        category: 'Dungeon',
        subcategory: 'M7 Terminal',
        options: ['Tank', 'Mage', 'Berserk', 'Archer']
    })
    thirdterminal = 2;

    @SelectorProperty({
        name: 'Fourth Terminal Class',
        description: 'Select which class should do the fourth terminals',
        category: 'Dungeon',
        subcategory: 'M7 Terminal',
        options: ['Tank', 'Mage', 'Berserk', 'Archer']
    })
    fourthterminal = 3;

    @SwitchProperty({
        name: 'Inventory HUD',
        description: 'Shows your current inventory(UAUOR)',
        category: 'HUD',
        subcategory: 'Inventory'
    })
    inventory = false;

    @ColorProperty({
        name: 'Inventory HUD Color',
        description: 'Change inventory hud background color',
        category: 'HUD',
        subcategory: 'Inventory'
    })
    inventorycolor = new Color(0.9, 0.9, 0.9, 0.3);

    @SwitchProperty({
        name: 'Composter Time HUD',
        description: 'Shows remaining time of composter',
        category: 'Garden',
        subcategory: 'Composter'
    })
    composter = false;

    @SwitchProperty({
        name: 'Dropship Warning',
        description: 'Warns you specified seconds before bomb will be dropped. Works even if the dropship is not rendered.',
        category: 'Kuudra',
        subcategory: 'Dropship Warning'
    })
    dropship = false;

    @SliderProperty({
        name: 'Warning time',
        description: 'Specify the number of seconds for warning before dropship explosion',
        min: 3,
        max: 10,
        category: 'Kuudra',
        subcategory: 'Dropship Warning'
    })
    dropshiptime = 5;

    @SwitchProperty({
        name: 'Send warning chat',
        description: 'Send party chat right before bomb drops.',
        category: 'Kuudra',
        subcategory: 'Dropship Warning'
    })
    senddropshipwarning = false;

    @SwitchProperty({
        name: 'Relic Waypoint',
        description: 'Display Wither King relic waypoint based on your class.',
        category: 'Dungeon',
        subcategory: 'Relic Waypoint'
    })
    relicwaypoint = false;

    @SwitchProperty({
        name: 'Soulflow HUD',
        description: 'Shows your remaining soulflow.',
        category: 'HUD',
        subcategory: 'Soulflow'
    })
    soulflow = false;

    @SwitchProperty({
        name: 'Energized Chunk Warning',
        description: 'Display warning when any energized chunks are near you.',
        category: 'Kuudra',
        subcategory: 'Energized Chunk'
    })
    energizedchunk = false;

    @SwitchProperty({
        name: 'Chest Glitch Coords Checker',
        description: 'Display if your coordinates are correct to glitch through the floor with chest.',
        category: 'Dungeon',
        subcategory: 'Chest Glitch'
    })
    chestglitch = false;

    @SwitchProperty({
        name: 'Kick Timer',
        description: 'Shows how long have you been kicked.',
        category: 'HUD',
        subcategory: 'Kick Timer'
    })
    kicktimer = false;

    @SwitchProperty({
        name: 'Debug Mode',
        description: 'Toggle debug mode.',
        category: 'Others',
        subcategory: 'Debug'
    })
    debugmode = false;

    @SwitchProperty({
        name: 'Ice Spray Notice',
        description: 'Notifies when you successfully ice sprayed dragons.',
        category: 'Dungeon',
        subcategory: 'Ice Spray'
    })
    icespray = false;

    /*
    @SwitchProperty({
        name: 'GPro Battery HUD',
        description: 'Shows current battery state of GPro X Superlight.',
        category: 'HUD',
        subcategory: 'GPro Battery'
    })
    gprobattery = false;
    */

    @SwitchProperty({
        name: 'Draw Pest Box',
        category: 'Garden',
        subcategory: 'Pest Box'
    })
    pestbox = false;

    @SwitchProperty({
        name: 'Pest ESP',
        description: 'Turning on this feature enables you to see pest box through wall. (UAYOR)',
        category: 'Garden',
        subcategory: 'Pest Box'
    })
    pestboxesp = false;

    @ColorProperty({
        name: 'Pest Box Color',
        category: 'Garden',
        subcategory: 'Pest Box'
    })
    pestboxcolor = Color.RED;

    @ColorProperty({
        name: 'Fishing Timer Background Color',
        category: 'Others',
        subcategory: 'Fishing Timer'
    })
    fishingtimercolor = Color.BLACK;

    @SwitchProperty({
        name: 'Dungeon Chest Profit Display',
        description: 'Shows chest profit calculated with the prices you set in M7.',
        category: 'Dungeon',
        subcategory: 'Chest Profit'
    })
    dungeonchestprofit = false;

    @SwitchProperty({
        name: 'Ashfang Helper',
        description: 'Various features which helps you kill Ashfang.',
        category: 'Crimson Isle',
        subcategory: 'Ashfang Helper'
    })
    ashfanghelper = false;

    @ColorProperty({
        name: 'Ashfang Color',
        category: 'Crimson Isle',
        subcategory: 'Ashfang Helper'
    })
    ashfangcolor = Color.PINK;

    @ColorProperty({
        name: 'Ashfang Blackhole Color',
        category: 'Crimson Isle',
        subcategory: 'Ashfang Helper'
    })
    ashfangbhcolor = Color.GRAY;

    @SwitchProperty({
        name: 'Sea Creature Detector',
        description: "Detects other players' sea creatures. (UAYOR)",
        category: 'Crimson Isle',
        subcategory: 'Sea Creature'
    })
    seacreature = false

    @SwitchProperty({
        name: 'Jawbus Waypoint',
        description: 'Draws jawbus waypoint. (UAYOR)',
        category: 'Crimson Isle',
        subcategory: 'Sea Creature'
    })
    jawbuswaypoint = false

    @SwitchProperty({
        name: 'Enable Sea Creature ESP',
        description: 'Shows sea creature box through walls.',
        category: 'Crimson Isle',
        subcategory: 'Sea Creature'
    })
    seacreatureesp = false

    @SwitchProperty({
        name: 'Stop rendering while holding fishing rod',
        description: 'Stop rendering sea creature mob boxes while holding fishing rod.',
        category: 'Crimson Isle',
        subcategory: 'Sea Creature'
    })
    fishingrodstoprender = false

    @SwitchProperty({
        name: 'Sea Screature Counter',
        description: 'Show estimated number of sea creatures loaded.',
        category: 'Crimson Isle',
        subcategory: 'Sea Creature'
    })
    seacreaturecounter = false;

    @SwitchProperty({
        name: 'Draw mob box',
        description: 'Draws a box to the specified mobs.',
        category: 'Bestiary',
        subcategory: 'Mob Box'
    })
    mobbox = false;

    @ButtonProperty({
        name: 'Select mobs',
        description: 'Open GUI for mob selection.',
        placeholder: 'Click!',
        category: 'Bestiary',
        subcategory: 'Mob Box'
    })
    bestiaryGui() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI('http://localhost:8085/bestiary'));
    }

    @SwitchProperty({
        name: 'Is it Derpy now?',
        description: 'Turn it on if the mayor Derpy is elected.',
        category: 'Bestiary',
        subcategory: 'Mob Box'
    })
    mobboxderpy = false;

    @ColorProperty({
        name: 'Mob box color',
        category: 'Bestiary',
        subcategory: 'Mob Box'
    })
    mobboxcolor = Color.PINK;

    @SwitchProperty({
        name: 'Mob ESP',
        description: 'Shows mob box through walls.',
        category: 'Bestiary',
        subcategory: 'Mob Box'
    })
    mobboxesp = false;

    @SwitchProperty({
        name: 'Spray Area Preview',
        description: 'Shows the area you gonna spray.',
        category: 'Garden',
        subcategory: 'Spray'
    })
    sprayarea = false;

    @SwitchProperty({
        name: 'Spray Timer',
        description: 'Timer for Spraynator.',
        category: 'Garden',
        subcategory: 'Spray'
    })
    spraytimer = false;

    @SwitchProperty({
        name: 'Always Warn',
        description: 'Shows title for a long time when the spray is expired.',
        category: 'Garden',
        subcategory: 'Spray'
    })
    sprayalwayswarn = false;

    @SwitchProperty({
        name: 'Show spawned pest area',
        description: '',
        category: 'Garden',
        subcategory: 'Pest Area'
    })
    pestarea = false;

    @SwitchProperty({
        name: 'Pest Title',
        description: 'Shows a title when the farming fortune is reduced by the pests.',
        category: 'Garden',
        subcategory: 'Pest Title'
    })
    pesttitle = false;

    @SwitchProperty({
        name: 'Feeder Timer',
        description: 'Shows a timer for Caducous Feeder cooldown.',
        category: 'Others',
        subcategory: 'Feeder Timer'
    })
    feedertimer = false;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription('HUD', 'A lot of Overlays');
        this.setCategoryDescription('Dungeon', 'Dungeon related things');
        this.setCategoryDescription('WIP', 'Takeshi is working on it');

        this.addDependency('Ragnarock Axe hotbar only', 'Ragnarock Axe Cooldown HUD');
        this.addDependency('Only show when in Kuudra\'s Hollow', 'Lifeline HUD');
        this.addDependency('Only show with Ragnarock Axe', 'Reaper Armor Cooldown HUD');
        this.addDependency('Last Breath hotbar only', 'Last Breath Hit Count HUD');
        this.addDependency('Last Breath reset length', 'Last Breath Hit Count HUD');
        this.addDependency('Terminal Waypoint Color', 'M7 Terminal Waypoint');
        this.addDependency('Inventory HUD Color', 'Inventory HUD');
        this.addDependency('Terminal Waypoint Color', 'M7 Terminal Waypoint');
        this.addDependency('Inventory HUD Color', 'Inventory HUD');
        this.addDependency('Warning time', 'Dropship Warning');
        this.addDependency('Pest ESP', 'Draw Pest Box');
        this.addDependency('Pest Box Color', 'Draw Pest Box');
        this.addDependency('Ashfang Color', 'Ashfang Helper');
        this.addDependency('Ashfang Blackhole Color', 'Ashfang Helper');
        this.addDependency('Enable Sea Creature ESP', 'Sea Creature Detector');
        this.addDependency('Stop rendering while holding fishing rod', 'Sea Creature Detector');
        this.addDependency('Sea Screature Counter', 'Sea Creature Detector');
        this.addDependency('Select mobs', 'Draw mob box');
        this.addDependency('Is it Derpy now?', 'Draw mob box');
        this.addDependency('Mob box color', 'Draw mob box');
        this.addDependency('Mob ESP', 'Draw mob box');
        this.addDependency('Always Warn', 'Spray Timer');

        m7NotRNGLootNames.forEach((loot) => {
            const attributes = createPropertyAttributesExt(
                PropertyType.TEXT,
                {
                    name: loot.name,
                    description: `Enter the price for ${loot.name}&r.`,
                    category: 'Dungeon',
                    subcategory: 'Chest Profit',
                }
            );
            const propertyData = new PropertyData(
                attributes,
                new ValueBackedPropertyValue(loot.price),
                this.getConfig()
            );
            this.registerProperty(propertyData);

            this.addDependency(loot.name, 'Dungeon Chest Profit Display');
        });
    }
}

export default new Settings();