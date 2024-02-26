const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX, COLORS } = require("./core/prepare");

const client = new Client({
    restTimeOffset: 0
});

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const XPCooldown = new Set();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
client.on("ready", () => {
    console.log(`${client.user.username} iniciado!`);
    client.user.setActivity(`às aulas | ${PREFIX}help`, {
        type: "WATCHING"
    });
});
client.on("warn", (info) => console.warn(info));
client.on("error", console.error);

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}

client.on("message", async (message) => {
    if (message.author.bot || !message.guild) return;
    let command, args = new Array();

    if (message.content.includes("https://us04web.zoom.us/") || message.content.includes("https://us02web.zoom.us/") || message.content.includes("https://zoom.us/")) {
        command = client.commands.get("zoomlink");
    }
    else if (message.content.includes("https://secure.isg.pt/moodleinete/mod/chat/")) {
        command = client.commands.get("moodlelink");
        args[0] = 1;
    }
    else if (message.content.includes("https://secure.isg.pt/moodleinete/mod/attendance/")) {
        command = client.commands.get("moodlelink");
        args[0] = 2;
    }
    else if (message.content.match(/cfx.re\/join\/....../g) != null) {
        command = client.commands.get("fivemlink");
    }
    else if (message.content.match(/\d+\.\d+\.\d+\.\d+:\d+/g) != null) {
        command = client.commands.get("csgolink");
    }
    else if (message.channel.name == "❰💡❱-sugestões") {
        command = client.commands.get("suggestion");
    }
    else {
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
        if (!prefixRegex.test(message.content)) return addXP(message);

        const [, matchedPrefix] = message.content.match(prefixRegex);

        args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return addXP(message);

        if (!cooldowns.has(command.name))
            cooldowns.set(command.name, new Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send({
                    "embed": {
                        "title": `Calma!`,
                        "description": `Espera ${timeLeft.toFixed(1)} segundos antes de usar o comando \`${command.name}\` novamente.`,
                        "color": COLORS.error,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        }
                    }
                });
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    if (message.channel.name != "❰🔅❱-just-me") {
        if (command.channel != undefined) {
            var cnt = 0;
            for (let channel of command.channel) {
                if (message.channel.name == channel)
                    cnt++;
            }
            if (cnt < 1) {
                message.delete();
                let channelM = message.guild.channels.cache.find(channel => channel.name == command.channel[0]);
                return message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": `Este não é o melhor canal para executar esse comando... Experimente o canal <#${channelM.id}>!`,
                        "color": COLORS.error,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        }
                    }
                })
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    });
            }
        }
        else {
            if (message.channel.name != "❰🤖❱-bots") {
                message.delete();
                return message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": "Este não é o melhor canal para executar esse comando... Experimente o canal <#703253259078467645>!",
                        "color": COLORS.error,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        }
                    }
                })
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    });
            }
        }
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        return message.channel.send({
            "embed": {
                "title": "Erro",
                "description": "Houve um erro ao executar esse comando.",
                "color": COLORS.error,
                "author": {
                    "name": `${message.author.username}`,
                    "icon_url": `${message.author.avatarURL()}`
                }
            }
        });
    }
});

function addXP(message) {
    const fs = require("fs");
    let leaderboard = require("./leaderboard.json");
    let config = require("./config.json");
    if (config.RULES.XP_DISABLE) return;
    if (message.member.roles.cache.some(role => role.name === "Lounge")) return;
    let receivedXP = Math.floor(Math.random() * 16) + 30, earnedRole = undefined, gotUltimate = false;
    if (!XPCooldown.has(message.member.id)) {
        XPCooldown.add(message.member.id);
        setTimeout(() => {
            XPCooldown.delete(message.member.id);
        }, config.XP_COOLDOWN * 1000);
        if (leaderboard[message.member.id] == undefined)
            leaderboard[message.member.id] = receivedXP;
        else
            leaderboard[message.member.id] += receivedXP;
        
        if (leaderboard[message.member.id] >= 3000) {
            earnedRole = message.guild.roles.cache.find(role => role.name == "Ultimate");
            if (message.member.roles.cache.some(role => role.name == "Ultimate"))
                earnedRole = undefined;
            else {
                message.member.roles.add(earnedRole);
                if (config.ULTIMATES[0] == undefined)
                    config.ULTIMATES[0] = message.member.id;
                else if (config.ULTIMATES[1] == undefined)
                    config.ULTIMATES[1] = message.member.id;
                else if (config.ULTIMATES[2] == undefined)
                    config.ULTIMATES[2] = message.member.id;
                else if (config.ULTIMATES[3] == undefined)
                    config.ULTIMATES[3] = message.member.id;
                gotUltimate = true;
            }
        }
        else if (leaderboard[message.member.id] >= 2000) {
            earnedRole = message.guild.roles.cache.find(role => role.name == "Expert");
            if (message.member.roles.cache.some(role => role.name == "Expert"))
                earnedRole = undefined;
            else
                message.member.roles.add(earnedRole);
        }
        else if (leaderboard[message.member.id] >= 1500) {
            earnedRole = message.guild.roles.cache.find(role => role.name == "Pro");
            if (message.member.roles.cache.some(role => role.name == "Pro"))
                earnedRole = undefined;
            else
                message.member.roles.add(earnedRole);
        }
        else if (leaderboard[message.member.id] >= 1000) {
            earnedRole = message.guild.roles.cache.find(role => role.name == "Poderoso");
            if (message.member.roles.cache.some(role => role.name == "Poderoso"))
                earnedRole = undefined;
            else
                message.member.roles.add(earnedRole);
        }
        else if (leaderboard[message.member.id] >= 500) {
            earnedRole = message.guild.roles.cache.find(role => role.name == "Frequente");
            if (message.member.roles.cache.some(role => role.name == "Frequente"))
                earnedRole = undefined;
            else
                message.member.roles.add(earnedRole);
        }

        if (earnedRole != undefined) {
            console.log(`${message.author.username} passou para o nível ${earnedRole.name}!`);
            message.guild.channels.cache.get("703253259078467645").send({
                "embed": {
                    "title": "<:LevelUp:819258343246921728> Level Up!",
                    "description": `Parabéns ${message.member.toString()}! Passas-te para o nível ${earnedRole.toString()}.`,
                    "color": COLORS.levelup,
                    "footer": {
                        "text": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    }
                }
            });
        }
        if (config.ULTIMATES[2] != undefined && config.ULTIMATES[3] == undefined && gotUltimate) {
            message.guild.members.cache.forEach(member => {
                if (member.roles.cache.find(role => role.name == "Vencedor do TGPSI Grand Prix")) member.roles.remove(message.guild.roles.cache.find(role => role.name == "Vencedor do TGPSI Grand Prix"));
            });
            message.guild.members.cache.get(config.ULTIMATES[0]).roles.add(message.guild.roles.cache.find(role => role.name == "Vencedor do TGPSI Grand Prix"));
            message.guild.members.cache.get(config.ULTIMATES[1]).roles.add(message.guild.roles.cache.find(role => role.name == "Vencedor do TGPSI Grand Prix"));
            message.guild.members.cache.get(config.ULTIMATES[2]).roles.add(message.guild.roles.cache.find(role => role.name == "Vencedor do TGPSI Grand Prix"));
            message.guild.channels.cache.get("780367715298050059").send({
                "embed": {
                    "title": `A ${config.N_GRAND_PRIX} TGPSI Grand Prix terminou!`,
                    "description": `Os vencedores da ${config.N_GRAND_PRIX} TGPSI Grand Prix são:\n\n:first_place: - <@${config.ULTIMATES[0]}>\n:second_place: - <@${config.ULTIMATES[1]}>\n:third_place: - <@${config.ULTIMATES[2]}>`,
                    "color": COLORS.levelup
                }
            });
        }
        fs.writeFile("./leaderboard.json", JSON.stringify(leaderboard, null, 4), (err) => {
            if (err) {
                console.log(err);
                return message.channel.send({
                    "embed": {
                        "title": "Erro!",
                        "description": "Houve um erro ao tentar modificar o leaderboard.json.",
                        "color": COLORS.error
                    }
                });
            }
        });
        fs.writeFile("./config.json", JSON.stringify(config, null, 4), (err) => {
            if (err) {
                console.log(err);
                return message.channel.send({
                    "embed": {
                        "title": "Erro!",
                        "description": "Houve um erro ao tentar modificar o config.json.",
                        "color": COLORS.error
                    }
                });
            }
        });
    }
}

client.on("voiceStateUpdate", async (oldState, newState) => {
    var today = new Date();
    if (newState.member.user.id == "713411895167680572") return;
    if (oldState.channelID != newState.channelID) {
        if (oldState.channelID == null) {
            return client.channels.cache.find(channel => channel.name === "❰➰❱-logs").send({
                "embed": {
                    "title": "Connect",
                    "description": `O utilizador <@${newState.member.user.id}> entrou no canal de voz!\n\n**Utilizador:** <@${newState.member.user.id}>\n**Antes:** <#${oldState.channelID}>\n**Depois:** <#${newState.channelID}>`,
                    "color": COLORS.done,
                    "timestamp": `${today.toISOString()}`,
                    "footer": {
                        "text": `${newState.channel.name}`
                    },
                    "thumbnail": {
                        "url": `${newState.member.user.avatarURL()}`
                    }
                }
            });
        }
        else if (newState.channelID == null) {
            return client.channels.cache.find(channel => channel.name === "❰➰❱-logs").send({
                "embed": {
                    "title": "Disconnect",
                    "description": `O utilizador <@${oldState.member.user.id}> saiu do canal de voz!\n\n**Utilizador:** <@${oldState.member.user.id}>\n**Antes:** <#${oldState.channelID}>\n**Depois:** <#${newState.channelID}>`,
                    "color": COLORS.error,
                    "timestamp": `${today.toISOString()}`,
                    "footer": {
                        "text": `${oldState.channel.name}`
                    },
                    "thumbnail": {
                        "url": `${oldState.member.user.avatarURL()}`
                    }
                }
            });
        }
        else {
            return client.channels.cache.find(channel => channel.name === "❰➰❱-logs").send({
                "embed": {
                    "title": "Move",
                    "description": `O utilizador <@${newState.member.user.id}> mudou/foi movido de canal de voz!\n\n**Utilizador:** <@${newState.member.user.id}>\n**Antes:** <#${oldState.channelID}>\n**Depois:** <#${newState.channelID}>`,
                    "color": COLORS.levelup,
                    "timestamp": `${today.toISOString()}`,
                    "footer": {
                        "text": `${newState.channel.name}`
                    },
                    "thumbnail": {
                        "url": `${newState.member.user.avatarURL()}`
                    }
                }
            });
        }
    }
    if (oldState.selfDeaf != newState.selfDeaf) {
        return client.channels.cache.find(channel => channel.name === "❰➰❱-logs").send({
            "embed": {
                "title": "Deafen",
                "description": `O utilizador <@${newState.member.user.id}> ${newState.selfDeaf ? "__ligou__" : "__tirou__"} o deafen!\n\n**Utilizador:** <@${newState.member.user.id}>\n**Antes:** ${oldState.selfDeaf ? "\:green_square:" : "\:red_square:"}\n**Depois:** ${newState.selfDeaf ? "\:green_square:" : "\:red_square:"}`,
                "color": COLORS.default,
                "timestamp": `${today.toISOString()}`,
                "footer": {
                    "text": `${newState.channel.name}`
                },
                "thumbnail": {
                    "url": `${newState.member.user.avatarURL()}`
                }
            }
        });
    }
    if (oldState.selfMute != newState.selfMute) {
        return client.channels.cache.find(channel => channel.name === "❰➰❱-logs").send({
            "embed": {
                "title": "Mute",
                "description": `O utilizador <@${newState.member.user.id}> ${newState.selfMute ? "__ligou__" : "__tirou__"} o mute!\n\n**Utilizador:** <@${newState.member.user.id}>\n**Antes:** ${oldState.selfMute ? "\:green_square:" : "\:red_square:"}\n**Depois:** ${newState.selfMute ? "\:green_square:" : "\:red_square:"}`,
                "color": COLORS.default,
                "timestamp": `${today.toISOString()}`,
                "footer": {
                    "text": `${newState.channel.name}`
                },
                "thumbnail": {
                    "url": `${newState.member.user.avatarURL()}`
                }
            }
        });
    }
    if (oldState.selfVideo != newState.selfVideo) {
        return client.channels.cache.find(channel => channel.name === "❰➰❱-logs").send({
            "embed": {
                "title": "Video",
                "description": `O utilizador <@${newState.member.user.id}> ${newState.selfVideo ? "__ligou__" : "__tirou__"} o video!\n\n**Utilizador:** <@${newState.member.user.id}>\n**Antes:** ${oldState.selfVideo ? "\:green_square:" : "\:red_square:"}\n**Depois:** ${newState.selfVideo ? "\:green_square:" : "\:red_square:"}`,
                "color": COLORS.default,
                "timestamp": `${today.toISOString()}`,
                "footer": {
                    "text": `${newState.channel.name}`
                },
                "thumbnail": {
                    "url": `${newState.member.user.avatarURL()}`
                }
            }
        });
    }
    if (oldState.streaming != newState.streaming) {
        return client.channels.cache.find(channel => channel.name === "❰➰❱-logs").send({
            "embed": {
                "title": "Live",
                "description": `O utilizador <@${newState.member.user.id}> ${newState.streaming ? "__começou__ uma" : "__terminou__ a"} live!\n\n**Utilizador:** <@${newState.member.user.id}>\n**Antes:** ${oldState.streaming ? "\:green_square: " : "\:red_square:"}\n**Depois:** ${newState.streaming ? "\:green_square:" : "\:red_square:"}`,
                "color": COLORS.default,
                "timestamp": `${today.toISOString()}`,
                "footer": {
                    "text": `${newState.channel.name}`
                },
                "thumbnail": {
                    "url": `${newState.member.user.avatarURL()}`
                }
            }
        });
    }
});