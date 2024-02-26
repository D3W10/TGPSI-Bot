const { COLORS } = require("../core/prepare");

module.exports = {
    name: "moveft",
    description: "Move todos os membros de um canal específico para outro",
    hidden: 1,
    execute(message, args) {
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador"))
        {
            if(args[0] == undefined) {
                return message.channel.send({
                    "embed": {
                        "title": "Nenhum canal foi introduzido",
                        "description": "Para mover todos os utilizadores de um canal de voz especifico para outro, utilize o seguinte comando:```$moveft ID-DO-CANAL-DE-ORIGEM ID-DO-CANAL-DE-DESTINO```",
                        "color": COLORS.error
                    }
                });
            }
            let channelO = message.guild.channels.cache.get(args[0]);
            let channelD = message.guild.channels.cache.get(args[1]);

            channelO.members.forEach((member) => {
                try {
                    member.voice.setChannel(channelD);
                } catch (error) {
                    console.log(error);
                }
            });
            console.log(`${message.author.username} moveu todos os utilizadores de ${channelO.name} para ${channelD.name}.`);

            return message.channel.send({
                "embed": {
                    "title": "Feito!",
                    "description": `Todos os utilizadores movidos de ${channelO} para ${channelD} com sucesso!`,
                    "color": COLORS.default
                }
            })
                .then(msg => {
                    msg.delete({ timeout: 3000 })
                });
        }
        else {
            console.log(`${message.author.username} tentou mover todos os utilizadores de ${channelO.name} para ${channelD.name}.`);
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