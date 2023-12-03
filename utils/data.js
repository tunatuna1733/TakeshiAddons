import PogObject from 'PogData';

const defaultData = {
    first: false,
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
    }
};

export let data = new PogObject('TakeshiAddons', defaultData, 'data.json');

export const resetData = () => {
    Object.keys(defaultData).forEach((k) => {
        data[k] = defaultData[k];
    });
    data.save();
};