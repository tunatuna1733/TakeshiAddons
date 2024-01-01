/**
 * Get item ID from item instance.
 * @param {Item} item 
 * @returns 
 */
const getItemId = (item) => {
    try {
        const itemId = item.getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getString('id');
        return itemId;
    } catch (e) {
        return 'UNKNOWN_ITEM';
    }
}

export default getItemId;