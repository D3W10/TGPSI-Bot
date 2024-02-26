const { COLORS } = require("../core/prepare");

module.exports = {
    name: "poll",
    description: "Cria uma poll",
    channel: ["❰📊❱-polls"],
    async execute(message, args) {
        message.delete();
        var regex = /((?<=')|(?<=")|(?<=”)|(?<=“))(.*)((?=')|(?=")|(?=”)|(?=“))/g;
        if(args[0] == undefined || args[1] == undefined) {
            return message.channel.send({
                "embed": {
                    "title": "Nenhum tempo ou texto foram introduzidos",
                    "description": 'Para criar uma poll, utilize o seguinte comando:```$poll TEMPO-EM-SEGUNDOS "TEXTO DA POLL"```',
                    "color": COLORS.error
                }
            });
        }
        var poll = await message.channel.send({
            "embed": {
                "title": "Hora da poll!",
                "description": message.content.match(regex)[0],
                "color": COLORS.default
            }
        });
        await poll.react("781519201465532428");
        await poll.react("781519221137735710");
        const filter = (reaction, user) => user.id !== message.client.user.id;
        var collector = poll.createReactionCollector(filter, { time: args[0] * 1000 });
        collector.on("collect", (reaction, user) => {
            switch (reaction.emoji.name) {
                case "Up":
                    break;
                case "Down":
                    break;
                default:
                    reaction.users.remove(user.id);
            }
        });
        collector.on("end", () => {
            poll.reactions.removeAll()
            let up = poll.reactions.cache.get("781519201465532428").count - 1;
            let down = poll.reactions.cache.get("781519221137735710").count - 1;
            if (up > down) {
                poll.edit({
                    "embed": {
                        "title": "A poll terminou!",
                        "description": `A poll teve mais upvotes que downvotes!\n\n*${message.content.match(regex)[0]}*`,
                        "color": COLORS.done,
                        "fields": [
                            {
                                "name": "<:Up:781519201465532428>",
                                "value": `${up} votos`,
                                "inline": true
                            },
                            {
                                "name": "<:Down:781519221137735710>",
                                "value": `${down} votos`,
                                "inline": true
                            }
                        ]
                    }
                });
            }
            else {
                if (up < down) {
                    poll.edit({
                        "embed": {
                            "title": "A poll terminou!",
                            "description": `A poll teve mais downvotes que upvotes!\n\n*${message.content.match(regex)[0]}*`,
                            "color": COLORS.down,
                            "fields": [
                                {
                                    "name": "<:Up:781519201465532428>",
                                    "value": `${up} votos`,
                                    "inline": true
                                },
                                {
                                    "name": "<:Down:781519221137735710>",
                                    "value": `${down} votos`,
                                    "inline": true
                                }
                            ]
                        }
                    });
                }
                else {
                    poll.edit({
                        "embed": {
                            "title": "A poll terminou!",
                            "description": `Houve um empate!\n\n*${message.content.match(regex)[0]}*`,
                            "color": COLORS.default,
                            "fields": [
                                {
                                    "name": "<:Up:781519201465532428>",
                                    "value": `${up} votos`,
                                    "inline": true
                                },
                                {
                                    "name": "<:Down:781519221137735710>",
                                    "value": `${down} votos`,
                                    "inline": true
                                }
                            ]
                        }
                    });
                }
            }
        });
    }
};