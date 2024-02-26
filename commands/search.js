const { MessageEmbed } = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");
const { YOUTUBE_API, COLORS } = require("../core/prepare");
const youtube = new YouTubeAPI(YOUTUBE_API);

module.exports = {
    name: "search",
    description: "Procura e seleciona videos para tocar",
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    async execute(message, args) {
        if (!args.length)
            return message.channel.send({
                "embed": {
                    "title": "Nenhum Nome foi introduzido",
                    "description": "Para procurar uma música, utilize o seguinte comando:```$search NOME-DO-VIDEO```",
                    "color": COLORS.dj
                }
            });
        if (message.channel.activeCollector)
            return message.channel.send({
                "embed": {
                    "title": "Ainda estou a aguardar resposta...",
                    "description": "Por favor responda à mensagem anterior antes de executar este comando outra vez.",
                    "color": COLORS.dj
                }
            });
        if (!message.member.voice.channel)
            return message.channel.send({
                "embed": {
                    "title": "Entre num Canal de Voz",
                    "description": "Antes de por uma música, entre num Canal de Voz.",
                    "color": COLORS.dj
                }
            });

        const search = args.join(" ");

        let resultsEmbed = new MessageEmbed()
            .setTitle(`Resultados para: ${search}`)
            .setDescription("Responda com um número a música que deseja tocar: ")
            .setColor(COLORS.dj);

        try {
            const results = await youtube.searchVideos(search, 10);
            results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

            let resultsMessage = await message.channel.send(resultsEmbed);

            function filter(msg) {
                const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;
                return pattern.test(msg.content);
            }

            message.channel.activeCollector = true;
            const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
            const reply = response.first().content;

            if (reply.includes(",")) {
                let songs = reply.split(",").map((str) => str.trim());

                for (let song of songs) {
                    await message.client.commands
                        .get("play")
                        .execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
                }
            } else {
                const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
                message.client.commands.get("play").execute(message, [choice]);
            }

            message.channel.activeCollector = false;
            resultsMessage.delete().catch(console.error);
            response.first().delete().catch(console.error);
        } catch (error) {
            console.error(error);
            message.channel.activeCollector = false;
            message.channel.send({
                "embed": {
                    "title": "Erro",
                    "description": `Houve um erro: \`\`\`${error.message}\`\`\``,
                    "color": COLORS.error
                }
            });
        }
    }
};