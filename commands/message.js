const { COLORS } = require("../core/prepare");

module.exports = {
    name: "message",
    description: "Manda mensagens relativas ao servidor",
    hidden: 1,
    channel: ["❰🕓❱-sala-de-espera", "❰📃❱-info"],
    execute(message, args) {
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador")) {
            if (args[0] == "info") {
                message.channel.send({
                    "embed": {
                        "title": "Cargos",
                        "description": "Neste servidor poderás encontrar uma imensa variedade de cargos, aqui temos os 5 cargos superiores:\n\n<@&703253258323492964> - Quem criou este lindo servidor de Discord!\n<@&703253258306584697> - As pessoas que vão estar sempre a ver se cumpres as regras.\n<@&703253258306584696> - Apenas os Bots têm este cargo, porque eles é que vão dominar o mundo!\n<@&703253258306584695> - Membros com este cargo têm poder máximo sobre os controlos de música do TGPSI Bot.\n<@&816289055351898172> - Cargo recebido após ganhar o TGPSI Grand Prix, este cargo é temporário até ao próximo concurso e concede a permissão de mover pessoas entre canais e acesso ao canal de voz <#704680823579738142>.",
                        "color": COLORS.info1,
                        "thumbnail": {
                            "url": message.guild.iconURL()
                        }
                    }
                });
                message.channel.send({
                    "embed": {
                        "description": "Agora os cargos progressivos, estes cargos poderão ser ganhos à medida que se fala no chat:\n\n<@&703253258306584691> - Este é o cargo que toda a gente recebe quando entra no servidor.\n<@&703253258306584692> - Para chegares a este cargo precisas de 500 de XP, se chegas-te a este cargo é porque és um utilizador frequente deste servidor.\n<@&703253258306584693> - Para chegares a este cargo precisas de 1000 de XP, quando aqui chegares tornas-te poderoso, mas não tens mais permissões que os outros. De nada!\n<@&703253258306584694> - Para chegares a este cargo precisas de ter 1500 de XP, apenas as pessoas que falam muito conseguem chegar aqui!\n<@&728564378638483457> - Para chegares a este cargo precisas de ter 2000 de XP, apenas as pessoas que falam mais que muito conseguem chegar aqui, bye bye Pro's!\n<@&781474104816828417> - Para chegares a este cargo precisas de ter 3000 de XP, se chegas-te aqui, muitos parabéns, és um tagarela!\n\nEstes cargos são removidos de todos assim que acabar essa TGPSI Grand Prix (houver 3 pessoas com a role <@&781474104816828417>), estas 3 pessoas ganham a role <@&816289055351898172>.",
                        "color": COLORS.info2,
                    }
                });
                return message.channel.send({
                    "embed": {
                        "description": "Finalmente os cargos especiais, alguns destes cargos são teporários ou poderão conceder permissões que nenhum outro tem:\n\n<@&718050007969955850> - Pessoas com este cargo poderão aceder a canais especiais para testes, este cargo é temporário.\n<@&816956331964497981> - Membros com esta role têm acesso ao Lounge, um canal de texto e um canal de voz, membros com esta role também não podem receber XP.\n<@&813823663475654666> - Se tens este cargo, é porque já não falas à muito tempo no servidor, com esta role deixas de ter acesso aos seguintes canais:\n⠀⠀• <#781439911198457886>\n⠀⠀• <#808317941648326666>\n⠀⠀• <#808317968873160774>\n⠀⠀• <#808317994098098186>\n⠀⠀• <#816994101295579168>\n⠀⠀• <#808616960127402014>\n⠀⠀• <#808640405344223262>\n⠀⠀• <#808650671012184065>\n⠀⠀• <#808692798097326131>\n⠀⠀• <#809755478720512010>\n<@&813823768732106853> - Se tens este cargo, é porque já não falas à mesmo muito tempo no servidor, com esta role deixas de ter acesso a todos os canais do cargo <@&813823663475654666> e:\n⠀⠀• <#704258241881964554>\n⠀⠀• <#715860438851649546>\n⠀⠀• <#703253259078467650>\n⠀⠀• <#703253259254628389>\n⠀⠀• <#812338872755159040>",
                        "color": COLORS.info3,
                        "footer": {
                            "text": "D3W10",
                            "icon_url": "https://d3w10.netlify.app/assets/logo.png"
                        }
                    }
                });
            }
            else if (args[0] == "espera") {
                return message.channel.send({
                    "embed": {
                        "title": "Bem-vindo à Sala de Espera",
                        "description": "Aguarde que o criador deste servidor te aceite. Quando fores aceite terás acesso a todos os canais de texto e de voz.\nEntretanto poderás ler as regras e outras informações no canal <#703253258822483976>.",
                        "color": COLORS.default,
                        "footer": {
                            "text": "D3W10",
                            "icon_url": "https://d3w10.netlify.app/assets/logo.png"
                        }
                    }
                });
            }
            else if (args[0] == "ferias") {
                return message.channel.send({
                    "embed": {
                        "title": ":tada: Férias",
                        "description": "Este servidor está encerrado para férias e irá ser aberto novamente em Setembro. Até lá, boas férias!",
                        "color": COLORS.default,
                        "footer": {
                            "text": "D3W10",
                            "icon_url": "https://d3w10.netlify.app/assets/logo.png"
                        }
                    }
                });
            }
        }
        else {
            console.log(`${message.author.username} tentou usar o comando message.`);
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