const fs = require("fs");
const { COLORS } = require("../core/prepare");
let config = require("../config.json");

module.exports = {
    name: "rules",
    description: "Mostra e muda algumas regras do bot",
    hidden: 1,
    channel: ["❰🤖❱-bots", "❰🏰❱-geral"],
    execute(message, args) {
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador")) {
            if (args[0] == undefined)
                return message.channel.send({
                    "embed": {
                        "title": "Nenhuma Regra introduzida",
                        "description": "Para mostrar/mudar uma regra, utilize o seguinte comando:```$rules NOME-DA-REGRA --VALOR-A-DEFINIR--```",
                        "color": COLORS.default
                    }
                });
            if (args[1] == undefined)
                return message.channel.send({
                    "embed": {
                        "title": `Regra ${args[0]}`,
                        "description": `O valor desta regra está definida como:\`\`\`${config[args[0]]}\`\`\``,
                        "color": COLORS.default
                    }
                });
            if (args[1] == "true")
                config.RULES[args[0]] = true;
            else if (args[1] == "false")
                config.RULES[args[0]] = false;
            else if (args[1] == "switch")
                config.RULES[args[0]] = !config.RULES[args[0]];
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
                console.log(`${message.author.username} modificou a regra ${args[0]} do TGPSI Bot com o valor ${args[1]}.`);
                return message.channel.send({
                    "embed": {
                        "title": `Regra ${args[0]} alterada`,
                        "description": `O valor desta regra está agora definida como:\`\`\`${config[args[0]]}\`\`\``,
                        "color": COLORS.default
                    }
                });
            });
        }
        else {
            console.log(`${message.author.username} tentou ver/modificar a regra ${args[0]} do TGPSI Bot (com o valor ${args[1]}).`);
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