const { COLORS } = require("../core/prepare");

module.exports = {
    name: "clip",
    description: "Toca um clip de música",
    aliases: ["c"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    async execute(message, args) {
        const { channel } = message.member.voice;
        const queue = message.client.queue.get(message.guild.id);

        if (!args.length)
            return message.channel.send({
                "embed": {
                    "title": "Nenhum nome foi introduzido",
                    "description": "Para tocar uma clip, utilize o seguinte comando:```$clip[c] NOME```",
                    "color": COLORS.error
                }
            });
        if (queue)
            return message.channel.send({
                "embed": {
                    "title": "Erro",
                    "description": "Não foi possível tocar este clipe porque há uma lista de reprodução ativa!",
                    "color": COLORS.error
                }
            });
        if (!channel)
            return message.channel.send({
                "embed": {
                    "title": "Entre num Canal de Voz",
                    "description": "Antes de por uma música, entre num Canal de Voz.",
                    "color": COLORS.dj
                }
            });

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            const dispatcher = queueConstruct.connection
                .play(`./sounds/${args[0]}.mp3`)
                .on("finish", () => {
                    message.client.queue.delete(message.guild.id);
                    channel.leave();
                })
                .on("error", err => {
                    message.client.queue.delete(message.guild.id);
                    channel.leave();
                    console.error(err);
                });
        } catch (error) {
            console.error(error);
        }
    }
};