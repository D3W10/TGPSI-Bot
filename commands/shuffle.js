const { COLORS } = require("../core/prepare");
const { check } = require("../core/modify");

module.exports = {
    name: "shuffle",
    description: "Põe as músicas da lista de reprodução de forma aleatória",
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send({
            "embed": {
                "title": "Não há nada na Lista de Reprodução",
                "description": "Adicione várias músicas à lista de reprodução antes de usar este comando.",
                "color": COLORS.dj
            }
        });
        if (!check(message)) return;

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        console.log(`As músicas irão agora ser tocadas de forma aleatória por ${message.author}!`);
        queue.textChannel.send({
            "embed": {
                "title": "<:Shuffle:780148261196922981> Aleatório",
                "description": `As músicas irão agora ser tocadas de forma aleatória por ${message.author}!`,
                "color": COLORS.dj
            }
        });
    }
};