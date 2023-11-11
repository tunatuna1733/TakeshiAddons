import PogObject from 'PogData';

export let data = new PogObject('TakeshiAddons', {
    armor: {
        x: 600,
        y: 400
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
    },
    armorStack: {
        terror: {
            x: 600,
            y: 300
        },
        crimson: {
            x: 600,
            y: 320
        }
    },
    reforge: {
        power: '',
        x: 20,
        y: 480
    },
    ragnarock: {
        x: 600,
        y: 280
    },
    lifeline: {
        x: 600,
        y: 250
    },
    reaper: {
        x: 600,
        y: 230
    },
    lastbreath: {
        x: 600,
        y: 210
    }
}, 'data.json');

register('gameUnload', () => {
    data.save();
});