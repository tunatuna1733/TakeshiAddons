import PogObject from 'PogData';

export let data = new PogObject('TakeshiAddons', {
    armor: {
        x: 0.6,
        y: 0.9,
        scale: 1.5
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
        scale: 1.5
    },
    terror: {
        x: 0.6,
        y: 0.5,
        scale: 1.5
    },
    crimson: {
        x: 0.6,
        y: 0.55,
        scale: 1.5
    },
    reforge: {
        power: '',
        x: 0.1,
        y: 0.9,
        scale: 1.5
    },
    ragnarock: {
        x: 0.6,
        y: 0.6,
        scale: 1.5
    },
    lifeline: {
        x: 0.6,
        y: 0.65,
        scale: 1.5
    },
    reaper: {
        x: 0.6,
        y: 0.7,
        scale: 1.5
    },
    lastbreath: {
        x: 0.6,
        y: 0.8,
        scale: 1.5
    },
    kuudraprofit: {
        x: 0.3,
        y: 0.4,
        scale: 1.2
    },
    flare: {
        x: 0.3,
        y: 0.9,
        scale: 1.5
    }
}, 'data.json');

register('gameUnload', () => {
    data.save();
});