const { COLORS } = require("../core/prepare");

module.exports = {
    name: "shutdown",
    description: "Encerra o bot",
    hidden: 1,
    execute(message, args) {
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador"))
        {
            if(!args.length)
            {
                message.channel.send({
                    "embed": {
                        "title": ":wave_tone1: Adeus",
                        "description": "Vou agora ficar offline. Vemo-nos por aí!",
                        "color": COLORS.default
                    }
                })
                    .then(msg => {
                        console.log("\nA Encerrar...\n\n");
                        return message.client.destroy();
                    });
            }
            else {
                const channel = message.client.channels.cache.find(channel => channel.name === "❰📢❱-anúncios");
                channel.send({
                    "content": "@here",
                    "embed": {
                        "title": ":rotating_light: Aviso!",
                        "description": `O bot vai **encerrar** em ${args[0]} segundos! Todos os serviços como música, links de Zoom e Moodle, links de FiveM, links de CS:GO, etc. deixarão de funcionar!`,
                        "color": COLORS.default
                    }
                });
                setTimeout(() => {
                    console.log("\nA Encerrar...\n\n");
                    return message.client.destroy();
                }, Number(args[0]) * 1000);
            }
        }
        else {
            console.log(`${message.author.username} tentou encerrar o bot.`);
            return message.channel.send({
                "embed": {
                    "title": "Erro!",
                    "description": "Não tens permissões para usar este comando!",
                    "color": COLORS.error
                }
            });
        }
    }
};