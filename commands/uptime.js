const { COLORS } = require("../core/prepare");

module.exports = {
    name: "uptime",
    aliases: ["u"],
    description: "Mostra há quanto tempo o bot está online",
    execute(message) {
        let seconds = Math.floor(message.client.uptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        return message.channel.send({
            "embed": {
                "title": "TGPSI Uptime",
                "description": `Aqui está o tempo que o ${message.client.user.username} está online:`,
                "color": COLORS.default,
                "fields": [
                    {
                        "name": "Horas",
                        "value": hours,
                        "inline": true
                    },
                    {
                        "name": "Minutos",
                        "value": minutes,
                        "inline": true
                    },
                    {
                        "name": "Segundos",
                        "value": seconds,
                        "inline": true
                    }
                ]
            }
        });
    }
};