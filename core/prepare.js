exports.canModifyQueue = (member) => {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel)
        return 1;
    if (!member.roles.cache.some(role => role.name == "DJ"))
        return 2;
    return 0;
};

let config = require("../config.json");

exports.PREFIX = config.PREFIX;
exports.TOKEN = config.TOKEN;
exports.YOUTUBE_API = config.YOUTUBE_API;
exports.SOUNDCLOUD_API = config.SOUNDCLOUD_API;
exports.CUTTLY_API = config.CUTTLY_API;
exports.COLORS = config.COLORS;
exports.MAX_PLAYLIST_SIZE = config.MAX_PLAYLIST_SIZE;
exports.XP_COOLDOWN = config.XP_COOLDOWN;
exports.N_GRAND_PRIX = config.N_GRAND_PRIX;
exports.ULTIMATES = config.ULTIMATES;