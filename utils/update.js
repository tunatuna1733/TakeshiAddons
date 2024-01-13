import { request } from '../axios';

export const getVersion = () => {
    const metadata = FileLib.read('./config/ChatTriggers/modules/TakeshiAddons/metadata.json');
    if (metadata === '') {
        console.log('[Takeshi] Failed to read metadata file.');
        return '0.0.0';
    }
    const metadataJson = JSON.parse(metadata);
    return metadataJson.version;
}

export const printHelp = () => {
    ChatLib.chat('&dTakeshiAddons Help');
    ChatLib.chat('&7|  &eRun &c"/takeshi" &eto open settings.');
    ChatLib.chat('&7| &bCommands');
    ChatLib.chat('&7|  &c"/scc"&7: &aPrint your scoreboard to chat so that you can copy it.');
    ChatLib.chat('&7|  &c"/cpp"&7: &aCopy your purse text on your scoreboard.');
    ChatLib.chat('&7|  &c"/fst"&7: &aOpen fishing timer in external window.');
    ChatLib.chat('&7| &bKeybind');
    ChatLib.chat('&7|  &aYou can bind a key for opening kuudra item price gui.');
}

export const printChangelog = (version) => {
    request({
        url: 'https://raw.githubusercontent.com/tunatuna1733/TakeshiAddons/master/changelog.json'
    }).then((res) => {
        const response = res.data;
        const changelogs = response[version];
        if (!changelogs) {
            console.log(`[Takeshi] Failed to fetch changelog for version ${version}`);
            return;
        }
        ChatLib.chat(`&dTakeshiAddons Changelog &av${version}`);
        changelogs.forEach((changelog) => {
            if (changelog.startsWith('# ')) {
                const title = changelog.replace('# ', '');
                ChatLib.chat(`&c&l${title}`);
            } else if (changelog.startsWith('- ')) {
                const change = changelog.replace('- ', '');
                ChatLib.chat(`  &e${change}`);
            }
        });
    }).catch((e) => {
        console.log(`[Takeshi] Failed to fetch changelog for version ${version}`);
        console.dir(e, { depth: null });
    })
}