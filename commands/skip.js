const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "skip",
    description: "Passa para a música seguinte",
    aliases: ["s"],
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

        queue.playing = true;
        queue.connection.dispatcher.end();
        console.log(`A música foi passada à frente for ${message.author.username}!`);
        queue.textChannel.send({
            "embed": {
                "title": "<:Forward:780115797875490846> Próxima",
                "description": `A música foi passada à frente por ${message.author}!`,
                "color": COLORS.dj
            }
        });
    }
};