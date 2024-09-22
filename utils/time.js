/**
 * Get formatted hour string from ms.
 * @param {number} milliseconds
 * @returns
 */
export const getHour = (milliseconds) => {
  const hour = milliseconds / 1000 / 60 / 60;
  return hour.toFixed();
};

export const getMinAndSec = (milliseconds) => {
  const min = milliseconds / 1000 / 60;
  const sec = (milliseconds - Math.trunc(min) * 1000 * 60) / 1000;
  return [min.toFixed(), sec.toFixed()];
};
