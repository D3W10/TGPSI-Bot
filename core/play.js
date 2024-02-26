const ytdl = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader").default;
const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    async play(song, message) {
        const { SOUNDCLOUD_API } = require("../core/prepare");

        const queue = message.client.queue.get(message.guild.id);

        if (!song) {
            setTimeout(function () {
                if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
                queue.channel.leave();
                queue.textChannel.send({
                    "embed": {
                        "title": "Gri gri... :cricket:",
                        "description": "Já à algum tempo que não estou a tocar música, vou sair do canal de voz em breve.",
                        "color": COLORS.dj
                    }
                })
                    .then(msg => {
                        msg.delete({ timeout: 10000 })
                    });
            }, 180000);
            queue.textChannel.send({
                "embed": {
                    "title": "A lista de reprodução chegou ao fim",
                    "description": "Todas as músicas na lista de reprodução foram reproduzidas, está na hora de por mais!",
                    "color": COLORS.dj
                }
            })
                .then(msg => {
                    msg.delete({ timeout: 5000 })
                });
            return message.client.queue.delete(message.guild.id);
        }

        let stream = null;
        let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

        try {
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
            } else if (song.url.includes("soundcloud.com")) {
                try {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_API);
                } catch (error) {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_API);
                    streamType = "unknown";
                }
            }
        } catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }

            console.error(error);
            return message.channel.send({
                "embed": {
                    "title": "Erro",
                    "description": `${error.message ? error.message : error}`,
                    "color": COLORS.error
                }
            });
        }

        queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

        const dispatcher = queue.connection
            .play(stream, { type: streamType })
            .on("finish", () => {
                if (collector && !collector.ended) collector.stop();

                if (queue.loop) {
                    let lastSong = queue.songs.shift();
                    queue.songs.push(lastSong);
                    module.exports.play(queue.songs[0], message);
                } else {
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                }
            })
            .on("error", (err) => {
                console.error(err);
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        try {
            var playingMessage = await queue.textChannel.send({
                "embed": {
                    "title": `A Tocar`,
                    "description": `Estou agora a tocar a música [${song.title}](${song.url})`,
                    "color": COLORS.dj
                }
            });
            await playingMessage.react("780115739256422420");
            await playingMessage.react("780115797875490846");
            await playingMessage.react("780115815193772082");
            await playingMessage.react("780115830364569621");
            await playingMessage.react("780115848370061372");
        } catch (error) {
            console.error(error);
        }

        const filter = (reaction, user) => user.id !== message.client.user.id;
        var collector = playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
        });

        collector.on("collect", (reaction, user) => {
            if (!queue) return;
            const member = message.guild.member(user);

            switch (reaction.emoji.name) {
                case "PlayPause":
                    reaction.users.remove(user).catch(console.error);
                    if (!check(message, member)) return;
                    if (queue.playing) {
                        queue.playing = !queue.playing;
                        queue.connection.dispatcher.pause(true);
                        console.log(`A música foi pausada por ${user.username}!`);
                        queue.textChannel.send({
                            "embed": {
                                "title": "<:Pause:780121185056587796> Pausa",
                                "description": `A música foi pausada por ${user}!`,
                                "color": COLORS.dj
                            }
                        });
                    }
                    else {
                        queue.playing = !queue.playing;
                        queue.connection.dispatcher.resume();
                        console.log(`A música foi retomada por ${user.username}!`);
                        queue.textChannel.send({
                            "embed": {
                                "title": "<:Play:780121164831129630> Retomar",
                                "description": `A música foi retomada por ${user}!`,
                                "color": COLORS.dj
                            }
                        });
                    }
                    break;
                case "Forward":
                    queue.playing = true;
                    reaction.users.remove(user).catch(console.error);
                    if (!check(message, member)) return;
                    queue.connection.dispatcher.end();
                    console.log(`A música foi passada à frente for ${user.username}!`);
                    queue.textChannel.send({
                        "embed": {
                            "title": "<:Forward:780115797875490846> Próxima",
                            "description": `A música foi passada à frente por ${user}!`,
                            "color": COLORS.dj
                        }
                    });
                    collector.stop();
                    break;
                case "Stop":
                    reaction.users.remove(user).catch(console.error);
                    if (!check(message, member)) return;
                    queue.songs = [];
                    console.log(`A música foi parada por ${user.username}!`);
                    queue.textChannel.send({
                        "embed": {
                            "title": "<:Stop:780115815193772082> Parar",
                            "description": `A música foi parada por ${user}!`,
                            "color": COLORS.dj
                        }
                    });
                    try {
                        queue.connection.dispatcher.end();
                    } catch (error) {
                        console.error(error);
                        queue.connection.disconnect();
                    }
                    collector.stop();
                    break;
                case "Repeat":
                    reaction.users.remove(user).catch(console.error);
                    if (!check(message, member)) return;
                    queue.loop = !queue.loop;
                    console.log(`A repetição foi ${queue.loop ? "ligada" : "desligada"} por ${user.username}!`);
                    queue.textChannel.send({
                        "embed": {
                            "title": "<:Repeat:780115830364569621> Repetir",
                            "description": `A repetição está agora ${queue.loop ? "**ligada**" : "**desligada**"} por ${user}!`,
                            "color": COLORS.dj
                        }
                    });
                    break;
                case "Mute":
                    reaction.users.remove(user).catch(console.error);
                    if (!check(message, member)) return;
                    if (queue.volume <= 0) {
                        queue.volume = 100;
                        queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
                        console.log(`A música foi dessilenciada por ${user.username}!`);
                        queue.textChannel.send({
                            "embed": {
                                "title": "<:Unmute:780125932546424842> Dessilenciada",
                                "description": `A música foi dessilenciada por ${user}!`,
                                "color": COLORS.dj
                            }
                        });
                    }
                    else {
                        queue.volume = 0;
                        queue.connection.dispatcher.setVolumeLogarithmic(0);
                        console.log(`A música foi silenciada por ${user.username}!`);
                        queue.textChannel.send({
                            "embed": {
                                "title": "<:Mute:780115848370061372> Silenciar",
                                "description": `A música foi silenciada por ${user}!`,
                                "color": COLORS.dj
                            }
                        });
                    }
                    break;
                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        });

        collector.on("end", () => {
            playingMessage.edit({
                "embed": {
                    "title": `Toquei`,
                    "description": `Eu toquei a música [${song.title}](${song.url})`,
                    "color": COLORS.dj
                }
            });
            playingMessage.reactions.removeAll().catch(console.error);
        });
    }
};