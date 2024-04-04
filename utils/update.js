import { request } from '../../axios';
import FileUtilities from '../../FileUtilities/main'
import { CHAT_PREFIX } from '../data/chat';

let latestVersion = '';

register('gameLoad', () => {
    checkForUpdate();
});

export const getCurrentVersion = () => {
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
    ChatLib.chat('&7|  &c"/ri <name>"&7: &aSave the inventory.');
    ChatLib.chat('&7| &bKeybind');
    ChatLib.chat('&7|  &aYou can bind a key for opening kuudra item price gui.');
    ChatLib.chat('&7   &aYou can bind a key for sending party chat about estimated debuff result on dragons.');
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
};

const checkForUpdate = () => {
    request({
        url: 'https://api.github.com/repos/tunatuna1733/TakeshiAddons/releases/latest'
    }).then((res) => {
        const response = res.data;
        latestVersion = response.tag_name;
        if (isNewerVersion(latestVersion, getCurrentVersion())) {
            ChatLib.chat(`${CHAT_PREFIX} &bA new version of TakeshiAddons (v${latestVersion}) is available!`);
            ChatLib.chat(new TextComponent(` &eClick here to update!`).setClick('run_command', `/takeshi forceupdate`));
        } else {
            ChatLib.chat(`${CHAT_PREFIX} &bYou are running the latest version of TakeshiAddons!`);
        }
    });
};

const isNewerVersion = (latest, current) => {
    const latestSplit = latest.split('.');
    const currentSplit = current.split('.');

    for (let i = 0; i < Math.min(latestSplit.length, currentSplit.length); i++) {
        if (parseInt(latestSplit[i]) > parseInt(currentSplit[i])) return true;
        else if (parseInt(latestSplit[i]) < parseInt(currentSplit[i])) return false;
    }

    return latestSplit.length > currentSplit.length;
};

export const update = (manual = false) => {
    if (manual) {
        checkForUpdate();
        return;
    }
    if (latestVersion === '') return;
    try {
        const downloadUrl = `https://github.com/tunatuna1733/TakeshiAddons/releases/download/${latestVersion}/TakeshiAddons.zip`.replace('https://', 'http://');    // workaround for wierd java 8 issue
        FileUtilities.urlToFile(downloadUrl, './config/ChatTriggers/modules/TakeshiAddons.zip', 1000, 1000);
    } catch (e) {
        ChatLib.chat(`${CHAT_PREFIX} &c[ERROR]Connection timed out while downloading update.`);
        return;
    }
    setTimeout(() => {
        FileLib.unzip('./config/ChatTriggers/modules/TakeshiAddons.zip', './config/ChatTriggers/modules/');
        const success = FileUtilities.delete('./config/ChatTriggers/modules/TakeshiAddons.zip');
        if (success) {
            ChatLib.chat(new TextComponent(`&aSuccessfully updated TakeshiAddons! Click here to complete!`).setClick('run_command', `/ct load`));
        } else {
            ChatLib.chat(`${CHAT_PREFIX} &c[ERROR]Failed to extract downloaded zip file :(`);
        }
    }, 1500);   // make sure that the download has completed
};