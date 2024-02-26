const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "volume",
    description: "Mostra/muda o volume da música",
    aliases: ["v"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);

        if (!queue) return message.channel.send({
            "embed": {
                "title": "Lista de Reprodução vazia",
                "description": "Não há nada na lista de reprodução nem nada a ser reproduzido.",
                "color": COLORS.dj
            }
        });
        if (!check(message))
            return message.channel.send({
                "embed": {
                    "title": "Entre num Canal de Voz",
                    "description": "Antes de por uma música, entre num Canal de Voz.",
                    "color": COLORS.dj
                }
            });

        if (!args[0])
            return message.channel.send({
                "embed": {
                    "title": "Volume",
                    "description": `O Volume atual é: **${queue.volume}%**`,
                    "color": COLORS.dj
                }
            });
        if (isNaN(args[0]))
            return message.channel.send({
                "embed": {
                    "title": "Volume",
                    "description": "Use um número para definir o volume.",
                    "color": COLORS.dj
                }
            });
        if (Number(args[0]) > 100 || Number(args[0]) < 0)
            return message.channel.send({
                "embed": {
                    "title": "Volume",
                    "description": "Use um número entre 0 e 100.",
                    "color": COLORS.dj
                }
            });

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
        console.log(`${message.author.username} definiu o volume para ${args[0]}!`);
        return queue.textChannel.send({
            "embed": {
                "title": "Volume",
                "description": `Volume definido para: **${args[0]}%**`,
                "color": COLORS.dj
            }
        });
    }
};