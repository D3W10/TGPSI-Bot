const { MessageEmbed } = require("discord.js");
const createBar = require("string-progressbar");
const { COLORS } = require("../core/prepare");

module.exports = {
    name: "nowplaying",
    description: "Mostra a música que está a ser reproduzida",
    aliases: ["np"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message) {
        const { channel } = message.member.voice;
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send({
            "embed": {
                "title": "Nada está a ser reproduzido",
                "description": "Não há nada a ser reproduzido, primeiro ponha uma música e tente novamente.",
                "color": COLORS.dj
            }
        });
        if (queue && channel !== message.guild.me.voice.channel) return message.channel.send({
            "embed": {
                "title": "Mude de Canal de Voz",
                "description": "Deves estar no mesmo canal que o bot para executar este comando.",
                "color": COLORS.dj
            }
        });
        const song = queue.songs[0];
        const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
        const left = song.duration - seek;

        let nowPlaying = new MessageEmbed()
            .setTitle("A tocar")
            .setDescription(`${song.title}\n${song.url}`)
            .setColor(COLORS.dj)
            .setAuthor(message.client.user.username);

        if (song.duration > 0) {
            nowPlaying.addField(
                "\u200b",
                new Date(seek * 1000).toISOString().substr(11, 8) +
                "[" +
                createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                "]" +
                (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
                false
            );
            nowPlaying.setFooter("Tempo Restante: " + new Date(left * 1000).toISOString().substr(11, 8));
        }

        return message.channel.send(nowPlaying);
    }
};