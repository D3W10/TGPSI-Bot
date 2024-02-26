const { COLORS } = require("../core/prepare");

module.exports = {
    name: "csgolink",
    description: "Põe os links do CS GO numa mensagem embed.",
    hidden: 1,
    channel: ["❰🔪❱-cs-go", "❰🍺❱-bar"],
    execute(message) {
        message.delete();
        if (message.content.startsWith("connect")) {
            console.log(`${message.author.username} enviou um link do CS GO (${message})!`);
            return message.channel.send({
                "embed": {
                    "title": "CS GO",
                    "description": `Prepare-se para morrer neste servidor de CS GO! \`\`\`${message.content}\`\`\``,
                    "color": COLORS.csgo,
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    },
                    "thumbnail": {
                        "url": "https://i.imgur.com/88uYfww.png"
                    }
                }
            });
        }
        else {
            var content = "connect " + message.content;
            console.log(`${message.author.username} enviou um link do CS GO (${content})!`);
            return message.channel.send({
                "embed": {
                    "title": "CS GO",
                    "description": `Prepare-se para morrer neste servidor de CS GO! \`\`\`${content}\`\`\``,
                    "color": COLORS.csgo,
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.avatarURL()}`
                    },
                    "thumbnail": {
                        "url": "https://i.imgur.com/88uYfww.png"
                    }
                }
            });
        }
    }
};