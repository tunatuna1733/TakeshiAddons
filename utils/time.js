export const getHour = (milliseconds) => {
    const hour = milliseconds / 1000 / 60 / 60;
    return hour.toFixed();
};
