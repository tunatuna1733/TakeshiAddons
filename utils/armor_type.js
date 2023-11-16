const getArmorType = (itemId) => {
    if (itemId.endsWith('HELMET')) return 'Helmet';
    else if (itemId.endsWith('CHESTPLATE')) return 'Chestplate';
    else if (itemId.endsWith('LEGGINGS')) return 'Leggings';
    else if (itemId.endsWith('BOOTS')) return 'Boots';
    else return 'Unknown';
}

export default getArmorType;