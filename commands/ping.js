const { COLORS } = require("../core/prepare");

module.exports = {
    name: "ping",
    description: "Mostra o ping do bot",
    cooldown: 10,
    execute(message) {
        return message.channel.send({
            "embed": {
                "title": "Ping",
                "description": `O ping do bot é: ${Math.round(message.client.ws.ping)}`,
                "color": COLORS.default
            }
        });
    }
};