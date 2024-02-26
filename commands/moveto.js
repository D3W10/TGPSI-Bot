const { COLORS } = require("../core/prepare");

module.exports = {
    name: "moveto",
    description: "Move todos os membros para um canal específico",
    hidden: 1,
    execute(message, args) {
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador"))
        {
            if(args[0] == undefined) {
                return message.channel.send({
                    "embed": {
                        "title": "Nenhum canal foi introduzido",
                        "description": "Para mover todos os utilizadores para um canal de voz especifico, utilize o seguinte comando:```$moveto ID-DO-CANAL```",
                        "color": COLORS.error
                    }
                });
            }
            let channel = message.guild.channels.cache.get(args[0]);

            message.guild.channels.cache.filter((channel) => channel.type == "voice").forEach((voicechannel) => {
                voicechannel.members.forEach((member) => {
                    try {
                        member.voice.setChannel(channel);
                    } catch (error) {
                        console.log(error);
                    }
                });
            });
            console.log(`${message.author.username} moveu todos os utilizadores para ${channel.name}.`);

            return message.channel.send({
                "embed": {
                    "title": "Feito!",
                    "description": `Todos os utilizadores movidos para ${channel} com sucesso!`,
                    "color": COLORS.default
                }
            })
                .then(msg => {
                    msg.delete({ timeout: 3000 })
                });
        }
        else {
            console.log(`${message.author.username} tentou mover todos os utilizadores para ${channel.name}.`);
            return message.channel.send({
                "embed": {
                    "title": "Erro!",
                    "description": "Não tens permissões para usar este comando!",
                    "color": COLORS.error
                }
            });
        }
    }
};