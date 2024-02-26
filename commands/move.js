const move = require("array-move");
const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "move",
    description: "Move a ordem das músicas na Lista de Reprodução",
    aliases: ["mv"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send({
            "embed": {
                "title": "Nada está a ser reproduzido",
                "description": "Não há nada a ser reproduzido, primeiro ponha uma música e tente novamente.",
                "color": COLORS.dj
            }
        });
        if (!check(message)) return;

        if (!args.length)
            return message.channel.send({
                "embed": {
                    "title": "Nenhum número foi introduzido",
                    "description": "Para mover uma música, utilize o seguinte comando:```$move POSIÇÃO-NA-LISTA-DE-REPRODUÇÃO```",
                    "color": COLORS.dj
                }
            });

        let song = queue.songs[args[0] - 1];

        queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
        console.log(`A música ${song.title} foi movida para ${args[1] == 1 ? 1 : args[1]} na lista de reprodução por ${message.author.username}!`);
        queue.textChannel.send({
            "embed": {
                "title": "Mover",
                "description": `A música ${song.title} foi movida para ${args[1] == 1 ? 1 : args[1]} na lista de reprodução por ${message.author}!`,
                "color": COLORS.dj
            }
        });
    }
};