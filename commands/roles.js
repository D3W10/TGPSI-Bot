const { COLORS } = require("../core/prepare");

module.exports = {
    name: "roles",
    description: "Permite dar certos cargos",
    hidden: 1,
    channel: ["❰🤖❱-bots", "❰🏰❱-geral"],
    async execute(message) {
        let config = require("../config.json");
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador") || message.member.roles.cache.some(role => role.name === "Moderador")) {
            if (config.RULES.GIVE_ROLES_BLOCK)
                return message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": "Não foi possivel adicionar/remover roles porque a regra `GIVE_ROLES_BLOCK` está definida como `true`. Por favor, peça a um <@&703253258323492964> para mudar o valor desta regra.",
                        "color": COLORS.error
                    }
                });
            function filter(msg) {
                const pattern = /^[0-9]{1}/g;
                return pattern.test(msg.content);
            }
            function filterMention(msg) {
                const pattern = /(?<=<@!)\d+(?=>)/g;
                return pattern.test(msg.content);
            }
            let rolesMsg = await message.channel.send({
                "embed": {
                    "title": "Cargos",
                    "description": "Escolha uma das opções abaixo:\n\n**[**1**]** - Dar cargo a um utilizador\n**[**2**]** - Remover cargo de um utilizador",
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
            let response, reply, roleChoice;
            try {
                response = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
                reply = parseInt(response.first().content);
            }
            catch (error) {
                rolesMsg.delete();
                return message.channel.send({
                    "embed": {
                        "title": "Erro!",
                        "description": "Não houve nenhuma resposta após 10 segundos.",
                        "color": COLORS.error
                    }
                });
            }
            message.channel.activeCollector = false;
            rolesMsg.delete();
            response.first().delete();
            if (reply == 1) {
                rolesMsg = await message.channel.send({
                    "embed": {
                        "title": "Cargos",
                        "description": "Escolha um cargo da lista de cargos abaixo:\n\n**[**1**]** - <@&813823663475654666>\n**[**2**]** - <@&813823768732106853>\n**[**3**]** - <@&816956331964497981>\n**[**4**]** - <@&718050007969955850>",
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
                try {
                    response = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
                    roleChoice = parseInt(response.first().content);
                }
                catch (error) {
                    rolesMsg.delete();
                    return message.channel.send({
                        "embed": {
                            "title": "Erro!",
                            "description": "Não houve nenhuma resposta após 10 segundos.",
                            "color": COLORS.error
                        }
                    });
                }
                message.channel.activeCollector = false;
                rolesMsg.delete();
                response.first().delete();
                if (roleChoice == 0) return;
                rolesMsg = await message.channel.send({
                    "embed": {
                        "title": "Cargos",
                        "description": "Por favor **mencione** o nome do utilizador que pretende dar a role.",
                        "color": COLORS.default,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        }
                    }
                });
                try {
                    response = await message.channel.awaitMessages(filterMention, { max: 1, time: 10000, errors: ["time"] });
                    reply = response.first().content.match(/(?<=<@!)\d+(?=>)/g)[0];
                }
                catch (error) {
                    rolesMsg.delete();
                    return message.channel.send({
                        "embed": {
                            "title": "Erro!",
                            "description": "Não houve nenhuma resposta após 10 segundos.",
                            "color": COLORS.error
                        }
                    });
                }
                message.channel.activeCollector = false;
                rolesMsg.delete();
                response.first().delete();
                let user = message.guild.members.cache.get(reply);
                var role, roleRem = undefined, roleRem2 = undefined;
                if (roleChoice == 1) {
                    role = message.guild.roles.cache.find(role => role.name == "Aviso 1");
                    roleRem = message.guild.roles.cache.find(role => role.name == "Aviso 2");
                    roleRem2 = message.guild.roles.cache.find(role => role.name == "Membro");
                }
                else if (roleChoice == 2) {
                    role = message.guild.roles.cache.find(role => role.name == "Aviso 2");
                    roleRem = message.guild.roles.cache.find(role => role.name == "Aviso 1");
                    roleRem2 = message.guild.roles.cache.find(role => role.name == "Membro");
                }
                else if (roleChoice == 3) {
                    role = message.guild.roles.cache.find(role => role.name == "Lounge");
                }
                else if (roleChoice == 4) {
                    role = message.guild.roles.cache.find(role => role.name == "Teste");
                }
                user.roles.add(role);
                if (roleRem != undefined) user.roles.remove(roleRem);
                if (roleRem2 != undefined) user.roles.remove(roleRem2);
                console.log(`${message.author.username} adicionou a role ${role.name} a ${user.user.username}.`);
                message.channel.send({
                    "embed": {
                        "title": "Sucesso!",
                        "description": `O cargo <@&${role.id}> foi adicionado a ${user.toString()}.`,
                        "color": COLORS.done,
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
            else if (reply == 2) {
                rolesMsg = await message.channel.send({
                    "embed": {
                        "title": "Cargos",
                        "description": "Escolha um cargo da lista de cargos abaixo:\n\n**[**1**]** - <@&813823663475654666>\n**[**2**]** - <@&813823768732106853>\n**[**3**]** - <@&816956331964497981>\n**[**4**]** - <@&718050007969955850>",
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
                try {
                    response = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
                    roleChoice = parseInt(response.first().content);
                }
                catch (error) {
                    rolesMsg.delete();
                    return message.channel.send({
                        "embed": {
                            "title": "Erro!",
                            "description": "Não houve nenhuma resposta após 10 segundos.",
                            "color": COLORS.error
                        }
                    });
                }
                message.channel.activeCollector = false;
                rolesMsg.delete();
                response.first().delete();
                if (roleChoice == 0) return;
                rolesMsg = await message.channel.send({
                    "embed": {
                        "title": "Cargos",
                        "description": "Por favor **mencione** o nome do utilizador que pretende remover a role.",
                        "color": COLORS.default,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        }
                    }
                });
                try {
                    response = await message.channel.awaitMessages(filterMention, { max: 1, time: 10000, errors: ["time"] });
                    reply = response.first().content.match(/(?<=<@!)\d+(?=>)/g)[0];
                }
                catch (error) {
                    rolesMsg.delete();
                    return message.channel.send({
                        "embed": {
                            "title": "Erro!",
                            "description": "Não houve nenhuma resposta após 10 segundos.",
                            "color": COLORS.error
                        }
                    });
                }
                message.channel.activeCollector = false;
                rolesMsg.delete();
                response.first().delete();
                let user = message.guild.members.cache.get(reply);
                var role, roleAdi = undefined;
                if (roleChoice == 1) {
                    role = message.guild.roles.cache.find(role => role.name == "Aviso 1");
                    roleAdi = message.guild.roles.cache.find(role => role.name == "Membro");
                }
                else if (roleChoice == 2) {
                    role = message.guild.roles.cache.find(role => role.name == "Aviso 2");
                    roleAdi = message.guild.roles.cache.find(role => role.name == "Membro");
                }
                else if (roleChoice == 3) {
                    role = message.guild.roles.cache.find(role => role.name == "Lounge");
                }
                else if (roleChoice == 4) {
                    role = message.guild.roles.cache.find(role => role.name == "Teste");
                }
                user.roles.remove(role);
                if (roleAdi != undefined) user.roles.add(roleAdi);
                console.log(`${message.author.username} removeu a role ${role.name} de ${user.user.username}.`);
                message.channel.send({
                    "embed": {
                        "title": "Sucesso!",
                        "description": `O cargo <@&${role.id}> foi removido de ${user.toString()}.`,
                        "color": COLORS.done,
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
            console.log(`${message.author.username} tentou usar o comando roles.`);
            message.channel.send({
                "embed": {
                    "title": "Erro!",
                    "description": "Não tens permissões para usar este comando!",
                    "color": COLORS.error
                }
            });
        }
    }
};