const { play } = require("../core/play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;
const { YOUTUBE_API, SOUNDCLOUD_API, COLORS } = require("../core/prepare");
const youtube = new YouTubeAPI(YOUTUBE_API);

module.exports = {
    name: "play",
    description: "Toca audio do YouTube e da SoundCloud",
    aliases: ["p"],
    cooldown: 3,
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    async execute(message, args) {
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
                "title": "Nenhum nome nem nenhum Link foram introduzidos",
                "description": "Para tocar uma música, utilize o seguinte comando:```$play[p] NOME || YOUTUBE || SOUNDCLOUD```",
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
                "description": "Não foi possivel tocar esta música porque a regra `MUSIC_DISABLE` está definida como `true`. Por favor, peça a um <@&703253258323492964> para mudar o valor desta regra.",
                "color": COLORS.error
            }
        });

        message.channel.send({
            "embed": {
                "title": "A Carregar",
                "description": "O TGPSI está a obter a música do YouTube/SoundCloud.",
                "color": COLORS.dj
            }
        })
            .then(msg => {
                msg.delete({ timeout: 5000 });
            });

        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.client.commands.get("playlist").execute(message, args, true);
        } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
            return message.client.commands.get("playlist").execute(message, args, true);
        }

        if (mobileScRegex.test(url)) {
            try {
                https.get(url, function (res) {
                    if (res.statusCode == "302") {
                        return message.client.commands.get("play").execute(message, [res.headers.location]);
                    } else {
                        return message.channel.send({
                            "embed": {
                                "title": "Erro",
                                "description": "Nada foi encontrado nesse link.",
                                "color": COLORS.error
                            }
                        });
                    }
                });
            } catch (error) {
                console.error(error);
                return message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": `Houve um erro:\`\`\`${error.message}\`\`\``,
                        "color": COLORS.error
                    }
                });
            }
            return message.channel.send({
                "embed": {
                    "title": "Aguarde",
                    "description": "Por favor aguarde, estamos a seguir o redirecionamento do link...",
                    "color": COLORS.default
                }
            })
                .then(msg => {
                    msg.delete({ timeout: 5000 })
                });
        }

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let songInfo = null;
        let song = null;

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (error) {
                console.error(error);
                return message.channel.send({
                    "embed": {
                        "title": "Erro ao entrar no Canal de Voz",
                        "description": `Não foi possível entrar no Canal de Voz: \`\`\`${error.message}\`\`\``,
                        "color": COLORS.error
                    }
                });
            }
        }
        else if (scRegex.test(url)) {
            try {
                const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_API);
                song = {
                    title: trackInfo.title,
                    url: trackInfo.permalink_url,
                    duration: Math.ceil(trackInfo.duration / 1000)
                };
            } catch (error) {
                console.error(error);
                return message.channel.send({
                    "embed": {
                        "title": "Nenhuma música foi encontrada com esse título",
                        "description": "Nenhuma música foi encontrada com esse nome, tenta novamente com outro nome ou use um link.",
                        "color": COLORS.dj
                    }
                });
            }
        }
        else {
            try {
                const results = await youtube.searchVideos(search, 1, { part: "snippet" });
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (error) {
                console.error(error);
                return message.channel.send({
                    "embed": {
                        "title": "Nenhuma música foi encontrada com esse título",
                        "description": "Nenhuma música foi encontrada com esse nome, tenta novamente com outro nome ou use um link.",
                        "color": COLORS.dj
                    }
                });
            }
        }

        console.log(`${message.author.username} pôs a música ${song.title}`);
        if (serverQueue) {
            serverQueue.songs.push(song);
            return serverQueue.textChannel.send({
                "embed": {
                    "title": `Música adicionada!`,
                    "description": `A música __${song.title}__ foi adicionada com sucesso`,
                    "color": COLORS.dj
                }
            });
        }

        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
        }
        catch (error) {
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
};