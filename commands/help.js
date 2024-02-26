const { MessageEmbed } = require("discord.js");
const { COLORS } = require("../core/prepare");

module.exports = {
    name: "help",
    description: "Mostra todos os comandos e suas descrições",
    aliases: ["h"],
    execute(message) {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle("TGPSI Help")
            .setDescription("Lista de todos os comandos:")
            .setColor(COLORS.default)
            .setThumbnail(message.client.user.avatarURL());

        commands.forEach((cmd) => {
            if (cmd.hidden !== 1)
            {
                helpEmbed.addField(
                    `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `[${cmd.aliases}]` : ""}**`,
                    `${cmd.description}`,
                    true
                );
            }
        });

        return message.channel.send(helpEmbed).catch(console.error);
    }
};