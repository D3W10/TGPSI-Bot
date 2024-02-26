const { COLORS } = require("../core/prepare");
const fs = require("fs"); 

module.exports = {
    name: "suggestion",
    description: "Põe as sugestões numa mensagem embed.",
    hidden: 1,
    channel: ["❰💡❱-sugestões"],
    execute(message) {
        let config = require("../config.json");
        config.N_SUGGESTION += 1;
        message.delete();
        message.channel.send({
            "embed": {
                "title": `Sugestão Nº${config.N_SUGGESTION}`,
                "description": message.content,
                "color": COLORS.suggestion,
                "footer": {
                    "text": `${message.author.username}`,
                    "icon_url": `${message.author.avatarURL()}`
                },
                "thumbnail": {
                    "url": `${message.author.avatarURL()}`
                }
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
};