const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "pause",
    description: "Põe a música atual na pausa",
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

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            console.log(`A música foi pausada por ${message.author.username}!`);
            return queue.textChannel.send({
                "embed": {
                    "title": "<:Pause:780121185056587796> Pausa",
                    "description": `A música foi pausada por ${message.author}!`,
                    "color": COLORS.dj
                }
            });
        }

        return message.channel.send({
            "embed": {
                "title": "Já está pausado",
                "description": "A música não precisa de ser pausada poís já está a ser parada.",
                "color": COLORS.dj
            }
        });
    }
};