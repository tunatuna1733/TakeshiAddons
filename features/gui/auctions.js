import formatNumToCoin from "../../utils/format_coin";

const Color = Java.type('java.awt.Color');

const createAuctionCard = (auctionData) => {
    const name = auctionData.itemNameWithFormat;
    const id = auctionData.itemId;
    const endUnix = auctionData.end;
    const price = formatNumToCoin(auctionData.price);
}