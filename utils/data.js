import PogObject from 'PogData';

export let data = new PogObject('TakeshiAddons', {
    armor: {
        x: 600,
        y: 400,
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
        x: 650,
        y: 400,
        scale: 1.5
    },
    terror: {
        x: 600,
        y: 300,
        scale: 1.5
    },
    crimson: {
        x: 600,
        y: 320,
        scale: 1.5
    },
    reforge: {
        power: '',
        x: 20,
        y: 480,
        scale: 1.5
    },
    ragnarock: {
        x: 600,
        y: 280,
        scale: 1.5
    },
    lifeline: {
        x: 600,
        y: 250,
        scale: 1.5
    },
    reaper: {
        x: 600,
        y: 230,
        scale: 1.5
    },
    lastbreath: {
        x: 600,
        y: 210,
        scale: 1.5
    }
}, 'data.json');

register('gameUnload', () => {
    data.save();
});