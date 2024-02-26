const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "loop",
    description: "Ligar ou desligar a repetição da musica",
    aliases: ["l"],
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

        queue.loop = !queue.loop;
        console.log(`A repetição foi ${queue.loop ? "ligada" : "desligada"} por ${message.author}!`);
        return queue.textChannel.send({
            "embed": {
                "title": "<:Repeat:780115830364569621> Repetir",
                "description": `A repetição está agora ${queue.loop ? "**ligada**" : "**desligada**"} por ${message.author}!`,
                "color": COLORS.dj
            }
        });
    }
};