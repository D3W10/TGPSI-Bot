const { MessageEmbed } = require("discord.js");
const { play } = require("../core/play");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader");
const { YOUTUBE_API, SOUNDCLOUD_API, MAX_PLAYLIST_SIZE, COLORS } = require("../core/prepare");
const youtube = new YouTubeAPI(YOUTUBE_API);

module.exports = {
    name: "playlist",
    aliases: ["pl"],
    description: "Toca playlists do YouTube",
    cooldown: 5,
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    async execute(message, args, fromplay) {
        const { channel } = message.member.voice;
        const serverQueue = message.client.queue.get(message.guild.id);
        let config = require("../config.json");
        
        if (!channel) return message.channel.send({
            "embed": {
                "title": "Entre num Canal de Voz",
                "description": "Antes de por uma música, entre num Canal de Voz.",
                "color": COLORS.dj
            }
        });
        if (serverQueue && channel !== message.guild.me.voice.channel) return message.channel.send({
            "embed": {
                "title": "Mude de Canal de Voz",
                "description": "Deves estar no mesmo canal que o bot para executar este comando.",
                "color": COLORS.dj
            }
        });
        if (!args.length) return message.channel.send({
            "embed": {
                "title": "Nenhum Nome nem nenhum Link foram introduzidos",
                "description": "Para tocar uma playlist, utilize o seguinte comando:```$playlist[pl] NOME || YOUTUBE```",
                "color": COLORS.dj
            }
        });
        if (!message.member.roles.cache.some(role => role.name === "Criador") || !message.member.roles.cache.some(role => role.name === "Moderador")) {
            if (channel.name == "❰🧿❱-hidden")
                return message.channel.send({
                    "embed": {
                        "title": "Hum...",
                        "description": `Não era suposto estares concentrado para o teste ${message.member.toString()}?`,
                        "color": COLORS.default
                    }
                });
        }
        if (config.RULES.MUSIC_DISABLE) return message.channel.send({
            "embed": {
                "title": "Erro",
                "description": "Não foi possivel tocar esta playlist porque a regra `MUSIC_DISABLE` está definida como `true`. Por favor, peça a um <@&703253258323492964> para mudar o valor desta regra.",
                "color": COLORS.error
            }
        });
        if (!fromplay) {
            message.channel.send({
                "embed": {
                    "title": "A Carregar",
                    "description": "O TGPSI está a obter a música do YouTube/SoundCloud.",
                    "color": COLORS.dj
                }
            })
                .then(msg => {
                    msg.delete({ timeout: 3000 })
                });
        }

        const search = args.join(" ");
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let playlist = null;
        let videos = [];

        if (urlValid) {
            try {
                playlist = await youtube.getPlaylist(url, { part: "snippet" });
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            }
            catch (error) {
                console.error(error);
                return message.channel.send({
                    "embed": {
                        "title": "Playlist não encontrada",
                        "description": `A playlist não foi encontrada:\`\`\`${error}\`\`\``,
                        "color": COLORS.error
                    }
                });
            }
        }
        else if (scdl.isValidUrl(args[0])) {
            if (args[0].includes("/sets/")) {
                message.channel.send(i18n.__("playlist.fetchingPlaylist"));
                playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_API);
                videos = playlist.tracks.map((track) => ({
                    title: track.title,
                    url: track.permalink_url,
                    duration: track.duration / 1000
                }));
            }
        }
        else {
            try {
                const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                playlist = results[0];
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            }
            catch (error) {
                console.error(error);
                return message.channel.send({
                    "embed": {
                        "title": "Playlist não encontrada",
                        "description": `A playlist não foi encontrada:\`\`\`${error}\`\`\``,
                        "color": COLORS.error
                    }
                });
            }
        }

        const newSongs = videos
            .filter((video) => video.title != "Private video" && video.title != "Deleted video")
            .map((video) => {
                return (song = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationSeconds
                });
        });

        serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

        let playlistEmbed = new MessageEmbed()
            .setTitle(`${playlist.title}`)
            .setDescription(newSongs.map((song, index) => `${index + 1}. ${song.title}`))
            .setURL(playlist.url)
            .setColor(COLORS.dj)

        if (playlistEmbed.description.length >= 2048)
            playlistEmbed.description =
                playlistEmbed.description.substr(0, 2007) + "\nA playlist é maior que o limite de caractéres...";

        message.channel.send(playlistEmbed);

        if (!serverQueue) {
            message.client.queue.set(message.guild.id, queueConstruct);

            try {
                queueConstruct.connection = await channel.join();
                await queueConstruct.connection.voice.setSelfDeaf(true);
                play(queueConstruct.songs[0], message);
            } catch (error) {
                console.error(`Não foi possível entrar no Canal de Voz: ${error}`);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send({
                    "embed": {
                        "title": "Erro ao entrar no Canal de Voz",
                        "description": `Não foi possível entrar no Canal de Voz: \`\`\`${error}\`\`\``,
                        "color": COLORS.error
                    }
                });
            }
        }
    }
};