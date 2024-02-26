const { MessageEmbed } = require("discord.js");
const { COLORS, N_GRAND_PRIX } = require("../core/prepare");
const fs = require("fs"); 

module.exports = {
    name: "leaderboard",
    description: "Permite ver a leaderboard da TGPSI Grand Prix",
    aliases: ["lb"],
    async execute(message, args) {
        message.delete();
        let leaderboard = require("../leaderboard.json");
        const sortedLB = Object.fromEntries(
            Object.entries(leaderboard).sort(([,a],[,b]) => b - a)
        );
        if (args[0] == "reset") {
            if (message.member.roles.cache.some(role => role.name === "Criador")) {
                let config = require("../config.json");
                function filter(msg) {
                    const pattern = /^[0-9]{1}/g;
                    return pattern.test(msg.content);
                }
                function filterText(msg) {
                    const pattern = /^[^\s]+/g;
                    return pattern.test(msg.content);
                }
                let confirmationMsg = await message.channel.send({
                    "embed": {
                        "title": "Tabela de Classificações",
                        "description": "Tem a certeza que pretende resetar a tabela de classificações? Todas as roles progressivas serão removidas de todos os membros bem como o seu XP!\nEscolha uma das opções abaixo:\n\n**[**1**]** - Sim, apagar\n**[**2**]** - Não, mas quero ver a tabela de classificações",
                        "color": COLORS.default,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        },
                        "footer": {
                            "text": "Escreva \"0\" para fechar o menu!"
                        }
                    }
                });
                let response = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
                let reply = parseInt(response.first().content);
                message.channel.activeCollector = false;
                confirmationMsg.delete();
                response.first().delete();
                if (reply == 0) return;
                if (reply == 1) {
                    message.guild.members.cache.forEach(member => {
                        if (member.id != "222726072708366336") {
                            if (member.roles.cache.find(role => role.name == "Frequente")) member.roles.remove(message.guild.roles.cache.find(role => role.name == "Frequente"));
                            if (member.roles.cache.find(role => role.name == "Poderoso")) member.roles.remove(message.guild.roles.cache.find(role => role.name == "Poderoso"));
                            if (member.roles.cache.find(role => role.name == "Pro")) member.roles.remove(message.guild.roles.cache.find(role => role.name == "Pro"));
                            if (member.roles.cache.find(role => role.name == "Expert")) member.roles.remove(message.guild.roles.cache.find(role => role.name == "Expert"));
                            if (member.roles.cache.find(role => role.name == "Ultimate")) member.roles.remove(message.guild.roles.cache.find(role => role.name == "Ultimate"));
                            if (member.roles.cache.find(role => role.name == "Vencedor do TGPSI Grand Prix")) member.roles.remove(message.guild.roles.cache.find(role => role.name == "Vencedor do TGPSI Grand Prix"));
                        }
                    });
                    let extenseNameMsg = await message.channel.send({
                        "embed": {
                            "title": "Tabela de Classificações",
                            "description": "Por favor **escreva** o número desta TGPSI Grand Prix por extenso.",
                            "color": COLORS.default,
                            "author": {
                                "name": `${message.author.username}`,
                                "icon_url": `${message.author.avatarURL()}`
                            }
                        }
                    });
                    response = await message.channel.awaitMessages(filterText, { max: 1, time: 20000, errors: ["time"] });
                    message.channel.activeCollector = false;
                    extenseNameMsg.delete();
                    response.first().delete();
                    config.N_GRAND_PRIX = response.first().content;
                    config.ULTIMATES = [];
                    let leader = {};
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
                    fs.writeFile("./leaderboard.json", JSON.stringify(leader, null, 4), (err) => {
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
                    message.channel.send({
                        "embed": {
                            "title": "Tabela de Classificações",
                            "description": "A tabela de classificações foi limpa e todos os cargos progressivos foram removidos de todos os membros!",
                            "color": COLORS.default,
                            "author": {
                                "name": `${message.author.username}`,
                                "icon_url": `${message.author.avatarURL()}`
                            }
                        }
                    });
                    const channel = message.client.channels.cache.find(channel => channel.name === "❰📢❱-anúncios");
                    return channel.send({
                        "embed": {
                            "title": `${config.N_GRAND_PRIX} TGPSI Grand Prix`,
                            "description": `Começou a ${config.N_GRAND_PRIX} TGPSI Grand Prix, as 3 primeiras pessoas a chegar a <@&781474104816828417> ganharão a role especial <@&816289055351898172> com permissões especiais!`,
                            "color": COLORS.levelup
                        }
                    });
                }
            }
            else {
                console.log(`${message.author.username} tentou resetar a tabela de classificações.`);
                return message.channel.send({
                    "embed": {
                        "title": "Erro!",
                        "description": "Não tens permissões para usar este comando com esse argumento!",
                        "color": COLORS.error
                    }
                });
            }
        }
        const embed = new MessageEmbed()
            .setTitle("Tabela de Classificações")
            .setColor(COLORS.default);
        let desc = `Aqui está a tabela de classificações da ${N_GRAND_PRIX} TGPSI Grand Prix:\n\n`, i = 0;
        Object.keys(sortedLB).forEach(function (key) {
            if (i == 0)
                desc = desc + `:first_place: - <@${key}> (${sortedLB[key]})\n`;
            else if (i == 1)
                desc = desc + `:second_place: - <@${key}> (${sortedLB[key]})\n`;
            else if (i == 2)
                desc = desc + `:third_place: - <@${key}> (${sortedLB[key]})\n`;
            else
                desc = desc + `**[**${i + 1}**]** - <@${key}> (${sortedLB[key]})\n`;
            i++;
        });
        embed.setDescription(desc);
        return message.channel.send(embed);
    }
};