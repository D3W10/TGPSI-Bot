const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "resume",
    description: "Retoma a música atual",
    aliases: ["r"],
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

        if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            console.log(`A música foi retomada por ${message.author}!`);
            return queue.textChannel.send({
                "embed": {
                    "title": "<:Play:780121164831129630> Retomar",
                    "description": `A música foi retomada por ${message.author}!`,
                    "color": COLORS.dj
                }
            });
        }

        return message.channel.send({
            "embed": {
                "title": "Já está retomado",
                "description": "A música não precisa de ser retomada poís já está a ser reproduzida.",
                "color": COLORS.dj
            }
        });
    }
};