// @ts-ignore
import { @Vigilant, @SwitchProperty, @TextProperty, @CheckboxProperty, @ButtonProperty, @SelectorProperty, @SliderProperty, @ColorProperty, @PercentSliderProperty, @DecimalSliderProperty, Color} from "../Vigilance/index";

@Vigilant("TakeshiAddons", "§d§lTakeshiAddons", {
    getCategoryComparetor: () => (a, b) => {
        const categories = ["HUD", "WIP"];
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
    armorhud = true;

    @SwitchProperty({
        name: 'Equipment HUD',
        description: 'Equipment HUD things',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    equipmenthud = true;

    @SwitchProperty({
        name: 'Reforge HUD',
        description: 'Display selected accessory reforge',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    reforgehud = true;

    @SwitchProperty({
        name: 'Crimson Dominus HUD',
        description: 'Display current dominus stack',
        category: 'HUD',
        subcategory: 'Kuudra Armor HUD'
    })
    crimsonhud = true;

    @SwitchProperty({
        name: 'Terror Hydra Strike HUD',
        description: 'Display current hydra strike stack',
        category: 'HUD',
        subcategory: 'Kuudra Armor HUD'
    })
    terrorhud = true;

    @SwitchProperty({
        name: 'Ragnarock Axe Cooldown HUD',
        description: 'Display Ragnarock Axe cooldown',
        category: 'HUD',
        subcategory: 'RagAxe Cooldown'
    })
    raghud = true;

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
    lifelinehud = true;

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
    reaperhud = true;

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
    lbhud = true;

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
        min: 5,
        max: 50,
        category: 'HUD',
        subcategory: 'Last Breath HUD'
    })
    lbreset = 10;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription('HUD', 'A lot of Overlays');
        this.setCategoryDescription('WIP', 'Takeshi is working on it');

        this.addDependency('Ragnarock Axe hotbar only', 'Ragnarock Axe Cooldown HUD');
        this.addDependency('Only show when in Kuudra\'s Hollow', 'Lifeline HUD');
        this.addDependency('Only show with Ragnarock Axe', 'Reaper Armor Cooldown HUD');
        this.addDependency('Last Breath hotbar only', 'Last Breath Hit Count HUD');
        this.addDependency('Last Breath reset length', 'Last Breath Hit Count HUD');
    }
}

export default new Settings();