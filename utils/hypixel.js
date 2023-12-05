export const isInSkyblock = () => {
    if (Server.getIP().includes('hypixel') && ChatLib.removeFormatting(Scoreboard.getTitle()).includes('SKYBLOCK'))
        return true;
    return false;
}

export const isInGarden = () => {
    // TODO
    return false;
}