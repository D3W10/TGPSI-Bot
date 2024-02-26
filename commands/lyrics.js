const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { COLORS } = require("../core/prepare");

module.exports = {
    name: "lyrics",
    description: "Obtem lyrics para a música que está a ser reproduzida",
    aliases: ["ly"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    async execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send({
            "embed": {
                "title": "Nada está a ser reproduzido",
                "description": "Não há nada a ser reproduzido, primeiro ponha uma música e tente novamente.",
                "color": COLORS.dj
            }
        });

        let lyrics = null;
        const title = queue.songs[0].title;
        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) lyrics = `Nenhumas lyrics foram encontradas para **${queue.songs[0].title}**.`;
        } catch (error) {
            lyrics = `Nenhumas lyrics foram encontradas para **${queue.songs[0].title}**.`;
        }

        let lyricsEmbed = new MessageEmbed()
            .setTitle("Lyrics")
            .setDescription(lyrics)
            .setColor(COLORS.dj)

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed).catch(console.error);
    }
};