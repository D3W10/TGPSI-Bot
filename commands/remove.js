const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "remove",
    description: "Remove músicas da lista de reprodução",
    aliases: ["rm"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;
        if (!queue)
            return message.channel.send({
                "embed": {
                    "title": "Não há nada na Lista de Reprodução",
                    "description": "Adicione várias músicas à lista de reprodução antes de usar este comando.",
                    "color": COLORS.dj
                }
            });
        if (!check(message)) return;

        if (!args.length)
            return message.channel.send({
                "embed": {
                    "title": "Nenhum número foi introduzido",
                    "description": "Para remover uma música, utilize o seguinte comando:```$remove NÚMERO-DA-LISTA-DE-REPRODUÇÃO```",
                    "color": COLORS.dj
                }
            });

        const arguments = args.join("");
        const songs = arguments.split(",").map((arg) => parseInt(arg));
        let removed = [];

        if (pattern.test(arguments)) {
            queue.songs = queue.songs.filter((item, index) => {
                if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
                else return true;
            });

            return queue.textChannel.send({
                "embed": {
                    "title": "<:Remove:780143390703747123> Remover",
                    "description": `As seguintes músicas foram removidas por ${message.author}:\n*${removed.map((song) => song.title).join("\n")}*`,
                    "color": COLORS.dj
                }
            });
        }
        else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
            return queue.textChannel.send({
                "embed": {
                    "title": "<:Remove:780143390703747123> Remover",
                    "description": `As seguintes músicas foram removidas por ${message.author}:\n*${queue.songs.splice(args[0] - 1, 1)[0].title}*`,
                    "color": COLORS.dj
                }
            });
        }
    }
};