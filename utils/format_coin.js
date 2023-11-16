const formatNumToCoin = (n) => {
    const integer_n = n.toFixed();
    return integer_n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default formatNumToCoin;