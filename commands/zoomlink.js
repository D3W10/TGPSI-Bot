const { COLORS } = require("../core/prepare");

module.exports = {
    name: "zoomlink",
    description: "Põe os links de zoom numa mensagem embed",
    hidden: 1,
    channel: ["❰🎥❱-links-zoom"],
    execute(message) {
        var msgPart = message.content.split(" ");
        message.delete();
        console.log(`${message.author.username} enviou um link do Zoom (${msgPart[1]}) (${msgPart[0]})!`);
        if (msgPart[1] == undefined) {
            return message.channel.send({
                "embed": {
                    "title": "Nenhuma Disciplina Introduzida",
                    "description": "Para enviar links de Zoom, utilize o seguinte comando:```LINK-DO-ZOOM DISCIPLINA```",
                    "color": COLORS.zoom,
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    }
                }
            });
        }
        else if (msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g) != null) {
            return message.channel.send({
                "embed": {
                    "title": msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g)[0],
                    "description": `Entre na aula de ${msgPart[1].match(/AC|PSI2|PSI|RC|ING|MAT|FQ|EF|PT|AI|OE/g)[0]} através do Zoom! Para entrar, clique no nome da disciplina que se encontra a Azul.`,
                    "url": msgPart[0],
                    "color": COLORS.zoom,
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    },
                    "thumbnail": {
                        "url": "https://i.imgur.com/Fif4TsF.png"
                    }
                }
            });
        }
        else {
            return message.channel.send({
                "embed": {
                    "title": "Hum...",
                    "description": `Acho que ${msgPart[1]} não é uma disciplina...`,
                    "color": COLORS.zoom,
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    }
                }
            });
        }
    }
};