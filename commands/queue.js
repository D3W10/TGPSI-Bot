const { MessageEmbed } = require("discord.js");
const { COLORS } = require("../core/prepare");

module.exports = {
    name: "queue",
    description: "Mostra a lista de reprodução e a música atual",
    aliases: ["q"],
    cooldown: 5,
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    async execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue)
            return message.channel.send({
                "embed": {
                    "title": "Lista de Reprodução vazia",
                    "description": "Não há nada na lista de reprodução nem nada a ser reproduzido.",
                    "color": COLORS.dj
                }
            });

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        const queueEmbed = await message.channel.send(
            `**Página Atual - ${currentPage + 1}/${embeds.length}**`,
            embeds[currentPage]
        );

        await queueEmbed.react("780143346374410260");
        await queueEmbed.react("780115815193772082");
        await queueEmbed.react("780143372396003338");

        const filter = (reaction, user) => ["Right", "Stop", "Left"].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", async (reaction, user) => {
            if (reaction.emoji.name == "Right") {
                if (currentPage < embeds.length - 1) {
                    currentPage++;
                    queueEmbed.edit(`**Página Atual - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                }
            } else if (reaction.emoji.name == "Left") {
                if (currentPage != 0) {
                    --currentPage;
                    queueEmbed.edit(`**Página Atual - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                }
            } else {
                collector.stop();
                reaction.message.reactions.removeAll();
            }
            await reaction.users.remove(message.author.id);
        });
    }
};

function generateQueueEmbed(message, queue) {
    let embeds = [];
    let k = 10;
    
    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `**[**${++j}**]** - [${track.title}](${track.url})`).join("\n");

        const embed = new MessageEmbed()
            .setTitle("Lista de Reprodução")
            .setColor(COLORS.dj)
            .setDescription(`**Música Atual: [${queue[0].title}](${queue[0].url})**\n\n${info}`)
        embeds.push(embed);
    }
    return embeds;
}