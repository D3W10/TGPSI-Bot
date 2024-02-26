const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "stop",
    description: "Pára a música",
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send({
            "embed": {
                "title": "Nada está a ser reproduzido",
                "description": "Não há nada a ser reproduzido, primeiro ponha uma música e tente novamente.",
                "color": COLORS.dj
            }
        });
        if (!check(message)) return;

        queue.songs = [];
        queue.connection.dispatcher.end();
        console.log(`A música foi parada por ${message.author}!`);
        queue.textChannel.send({
            "embed": {
                "title": "<:Stop:780115815193772082> Parar",
                "description": `A música foi parada por ${message.author}!`,
                "color": COLORS.dj
            }
        });
    }
};