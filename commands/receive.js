const { MessageEmbed } = require("discord.js");
const { COLORS } = require("../core/prepare");

module.exports = {
    name: "receber",
    description: "Recebe ficheiros do TGPSI Share",
    aliases: ["rc"],
    async execute(message, args) {
        return message.channel.send({
            "embed": {
                "title": "Deprecated",
                "description": "Este comando não está disponível para uso neste momento.",
                "color": COLORS.error
            }
        });
        if (!args.length)
            return message.channel.send({
                "embed": {
                    "title": "Nenhum código foi introduzido",
                    "description": "Para receber um ficheiro do TGPSI Share, use:```$receber[rc] CÓDIGO```",
                    "color": COLORS.error
                }
            });
        let urlPlus = `https://we.tl/t-${args}`;
        let ShareEmbed = new MessageEmbed()
        try {
            /*let ReceiveWT = await getInfo(urlPlus);
            ShareEmbed.setTitle("TGPSI Share")
            .setDescription(`O ficheiro está disponível para ser transferido!\n[Transferir Agora](${ReceiveWT.downloadURI})`)
            .setColor(COLORS.done)
            .attachFiles(["./assets/receive.png"])
            .setThumbnail("attachment://receive.png");
            ReceiveWT.content.items.forEach((file) => {
                SizeWT = (file.size / 1024) / 1024;
                ShareEmbed.addField(
                    `**${file.name}**`,
                    `${SizeWT.toFixed(2)} MB`,
                    false
                );
            });*/
        }
        catch (error) {
            ShareEmbed.setTitle("TGPSI Share");
            ShareEmbed.setDescription("O código de ficheiro é inválido!");
            ShareEmbed.setColor(COLORS.error);
        }
        return message.channel.send(ShareEmbed);
    }
};