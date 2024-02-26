const { COLORS } = require("../core/prepare");
const fs = require("fs");

module.exports = {
    name: "clips",
    description: "Mostra todos os clipes disponíveis",
    aliases: ["cs"],
    channel: ["❰🎵❱-musica", "❰🎶❱-musica", "❰🎼❱-musica"],
    execute(message) {
        fs.readdir("./sounds", function (err, files) {
            if (err) return console.log("Não foi possivel ler a pasta: " + err);

            let clips = [];

            files.forEach(function (file) {
                clips.push(file.substring(0, file.length - 4));
            });

            message.channel.send({
                "embed": {
                    "title": "Clipes",
                    "description": `${clips.join(" ")}`,
                    "color": COLORS.dj
                }
            });
        });
    }
};