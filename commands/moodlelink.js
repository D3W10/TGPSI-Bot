const { COLORS } = require("../core/prepare");

module.exports = {
    name: "moodlelink",
    description: "Põe os links de moodle numa mensagem embed",
    hidden: 1,
    channel: ["❰💬❱-links-moodle"],
    execute(message, args) {
        var msgPart = message.content.split(" ");
        message.delete();
        console.log(`${message.author.username} enviou um link do Moodle (${msgPart[1]}) (${msgPart[0]})!`);
        if (msgPart[1] == undefined) {
            return message.channel.send({
                "embed": {
                    "title": "Nenhuma Disciplina Introduzida",
                    "description": "Para enviar links de Moodle, utilize o seguinte comando:```LINK-DO-MOODLE DISCIPLINA```",
                    "color": COLORS.moodle,
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    }
                }
            });
        }
        else if (msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g) != null) {
            if (args[0] == 1) {
                return message.channel.send({
                    "embed": {
                        "title": msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g)[0],
                        "description": `Entre no chat de ${msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g)[0]} através do Moodle! Para entrar, clique no nome da disciplina que se encontra a Azul.`,
                        "url": msgPart[0],
                        "color": COLORS.moodle,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        },
                        "thumbnail": {
                            "url": "https://i.imgur.com/8Sz6OLQ.png"
                        }
                    }
                });
            }
            else if (args[0] == 2) {
                return message.channel.send({
                    "embed": {
                        "title": msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g)[0],
                        "description": `Marque presença a ${msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g)[0]} através do Moodle! Para marcar, clique no nome da disciplina que se encontra a Azul.`,
                        "url": msgPart[0],
                        "color": COLORS.moodle,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        },
                        "thumbnail": {
                            "url": "https://i.imgur.com/8Sz6OLQ.png"
                        }
                    }
                });
            }
        }
        else {
            return message.channel.send({
                "embed": {
                    "title": "Hum...",
                    "description": `Acho que ${msgPart[1]} não é uma disciplina...`,
                    "color": COLORS.moodle,
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    }
                }
            });
        }
    }
};