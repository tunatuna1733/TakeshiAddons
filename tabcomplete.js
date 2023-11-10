// ref from BloomCore by UnclaimedBloom6

export const filterTabCompletions = (args, completions) => {
    return [...new Set(completions)].filter(a => a.toLowerCase().startsWith(args.length ? args[0].toLowerCase() : ""))
}

export const getTabCompletion = (args, options) => {
    let final = []
    // if (options.extra) final = final.concat(extra)
    // if (options.party) final = final.concat(Object.keys(Party.members))
    if (options.world) final = final.concat(World.getAllPlayers().filter(a => a.getPing() == 1).map(a => a.getName()))
    return filterTabCompletions(args, final)
}