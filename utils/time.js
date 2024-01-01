/**
 * Get formatted hour string from ms.
 * @param {number} milliseconds 
 * @returns 
 */
export const getHour = (milliseconds) => {
    const hour = milliseconds / 1000 / 60 / 60;
    return hour.toFixed();
};
