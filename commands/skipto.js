const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "skipto",
    description: "Passa até à música selecionada",
    aliases: ["st"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message, args) {
        if (!args.length || isNaN(args[0]))
            return message.channel.send({
                "embed": {
                    "title": "Nenhum número foi introduzido",
                    "description": "Para passar até uma certa música, use:```$skipto|st NÚMERO-DA-LISTA-DE-REPRODUÇÃO```",
                    "color": COLORS.dj
                }
            });

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send({
            "embed": {
                "title": "Não há nada na Lista de Reprodução",
                "description": "Adicione várias músicas à lista de reprodução antes de usar este comando.",
                "color": COLORS.dj
            }
        });
        if (!check(message)) return;
        if (args[0] > queue.songs.length)
            return queue.textChannel.send({
                "embed": {
                    "title": `Lista de Reprodução muito pequena`,
                    "description": `A Lista de Reprodução tem apenas ${queue.songs.length}!`,
                    "color": COLORS.dj
                }
            });

        queue.playing = true;
        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        } else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }
  
        queue.connection.dispatcher.end();
        console.log(`${args[0] - 1} músicas foram passadas à frente for ${message.author.username}!`);
        queue.textChannel.send({
            "embed": {
                "title": `<:Forward:780115797875490846> Foram passadas ${args[0] - 1} músicas`,
                "description": `${args[0] - 1} músicas foram passadas à frente for ${message.author}!`,
                "color": COLORS.dj
            }
        });
    }
};