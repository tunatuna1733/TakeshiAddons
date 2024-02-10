import PogObject from 'PogData';

const defaultData = {
    first: false,
    helpPrinted: false,
    version: '0.1.9',
    armor: {
        x: 0.6,
        y: 0.75,
        scale: 2.0
    },
    equipment: {
        slot1: '',
        slot2: '',
        slot3: '',
        slot4: '',
        id1: '',
        id2: '',
        id3: '',
        id4: '',
        x: 0.7,
        y: 0.8,
        scale: 1.1
    },
    terror: {
        x: 0.6,
        y: 0.33,
        scale: 1.5
    },
    crimson: {
        x: 0.6,
        y: 0.37,
        scale: 1.5
    },
    reforge: {
        power: '',
        x: 0.02,
        y: 0.95,
        scale: 1.5
    },
    ragnarock: {
        x: 0.6,
        y: 0.41,
        scale: 1.5
    },
    lifeline: {
        x: 0.6,
        y: 0.45,
        scale: 1.5
    },
    reaper: {
        x: 0.6,
        y: 0.49,
        scale: 1.5
    },
    lastbreath: {
        x: 0.6,
        y: 0.53,
        scale: 1.5
    },
    kuudraprofit: {
        x: 0.23,
        y: 0.34,
        scale: 1.2
    },
    flare: {
        x: 0.3,
        y: 0.93,
        scale: 1.5
    },
    inventory: {
        x: 0.6,
        y: 0.2,
        scale: 1.0
    },
    composter: {
        x: 0.9,
        y: 0.1,
        scale: 1.2
    },
    dropship: {
        x: 0.6,
        y: 0.57,
        scale: 1.5
    },
    soulflow: {
        x: 0.8,
        y: 0.6,
        scale: 1.5
    },
    chestglitch: {
        x: 0.4,
        y: 0.6,
        scale: 2.0
    },
    kicktimer: {
        x: 0.4,
        y: 0.65,
        scale: 1.5
    },
    gprobattery: {
        x: 0.9,
        y: 0.9,
        scale: 1
    },
    chestprofit: {
        x: 0.3,
        y: 0.4,
        scale: 1
    },
    reminv: {
        x: 0.1,
        y: 0.1,
        scale: 1
    }
};

const defaultGardenData = {
    upgrades: {
        speed: 1,
        drop: 1,
        fuel: 1,
        organic: 1,
        cost: 1
    },
    endTime: 0
}

export let data = new PogObject('TakeshiAddons', defaultData, 'data.json');
export let gardenData = new PogObject('TakeshiAddons', defaultGardenData, 'garden.json');
export let inventoryData = new PogObject('TakeshiAddons', {}, 'inventory.json');
export let bestiaryData = new PogObject('TakeshiAddons', { data: [] }, 'bestiary.json');

export const resetData = () => {
    Object.keys(defaultData).forEach((k) => {
        data[k] = defaultData[k];
    });
    data.save();
};