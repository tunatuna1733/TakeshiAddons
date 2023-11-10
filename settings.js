// @ts-ignore
import { @Vigilant, @SwitchProperty, @TextProperty, @CheckboxProperty, @ButtonProperty, @SelectorProperty, @SliderProperty, @ColorProperty, @PercentSliderProperty, @DecimalSliderProperty, Color} from "../Vigilance/index";

@Vigilant("TakeshiAddons", "§d§lTakeshiAddons", {
    getCategoryComparetor: () => (a, b) => {
        const categories = ["HUD", "WIP"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    @SwitchProperty({
        name: 'Armor HUD',
        description: 'Armor HUD things',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    armorhud = true;

    @ButtonProperty({
        name: 'Move Armor HUD',
        description: 'Click to edit Armor HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'General HUD'
    })
    armorGui() {
        ChatLib.command('takeshi armorhud', true);
    }

    @SwitchProperty({
        name: 'Equipment HUD',
        description: 'Equipment HUD things',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    equipmenthud = true;

    @ButtonProperty({
        name: 'Move Equipment HUD',
        description: 'Click to edit Equipment HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'General HUD'
    })
    eqGui() {
        ChatLib.command('takeshi equipmenthud', true);
    }

    @SwitchProperty({
        name: 'Reforge HUD',
        description: 'Display selected accessory reforge',
        category: 'HUD',
        subcategory: 'General HUD'
    })
    reforgehud = true;

    @ButtonProperty({
        name: 'Move Reforge HUD',
        description: 'Click to edit Reforge HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'General HUD'
    })
    reforgeGui() {
        ChatLib.command('takeshi reforgehud', true);
    }

    @SwitchProperty({
        name: 'Crimson Dominus HUD',
        description: 'Display current dominus stack',
        category: 'HUD',
        subcategory: 'Kuudra Armor HUD'
    })
    crimsonhud = true;

    @ButtonProperty({
        name: 'Move Dominus HUD',
        description: 'Click to edit Dominus HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'Kuudra Armor HUD'
    })
    dominusGui() {
        ChatLib.command('takeshi dominushud', true);
    }

    @SwitchProperty({
        name: 'Terror Hydra Strike HUD',
        description: 'Display current hydra strike stack',
        category: 'HUD',
        subcategory: 'Kuudra Armor HUD'
    })
    terrorhud = true;

    @ButtonProperty({
        name: 'Move Hydra HUD',
        description: 'Click to edit Hydra Strike HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'Kuudra Armor HUD'
    })
    hydraGui() {
        ChatLib.command('takeshi hydrahud', true);
    }

    @SwitchProperty({
        name: 'Ragnarock Axe Cooldown HUD',
        description: 'Display Ragnarock Axe cooldown',
        category: 'HUD',
        subcategory: 'RagAxe Cooldown'
    })
    raghud = true;

    @SwitchProperty({
        name: 'Only show when in hotbar',
        description: 'Only show when Ragnarock Axe is in hotbar',
        category: 'HUD',
        subcategory: 'RagAxe Cooldown'
    })
    raghotbar = true;

    @ButtonProperty({
        name: 'Move Ragnarock HUD',
        description: 'Click to edit Ragnarock Axe HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'RagAxe Cooldown'
    })
    ragGui() {
        ChatLib.command('takeshi raghud', true);
    }

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

    @ButtonProperty({
        name: 'Move Lifeline HUD',
        description: 'Click to edit Lifeline HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'Lifeline Display'
    })
    lifelineGui() {
        ChatLib.command('takeshi lifelinehud', true);
    }

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

    @ButtonProperty({
        name: 'Move Reaper Armor HUD',
        description: 'Click to edit Reaper Armor HUD location',
        category: 'HUD',
        placeholder: 'Click!',
        subcategory: 'Reaper Armor Cooldown'
    })
    reaperGui() {
        ChatLib.command('takeshi reaperhud', true);
    }

    constructor() {
        this.initialize(this);
        this.setCategoryDescription('HUD', 'A lot of Overlays');
        this.setCategoryDescription('WIP', 'Takeshi is working on it');
    }
}

export default new Settings();