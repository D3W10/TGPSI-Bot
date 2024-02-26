const { COLORS } = require("../core/prepare");

module.exports = {
    name: "teste",
    description: "Permite dar as roles de Teste a todos no Geral 1",
    hidden: 1,
    execute(message, args) {
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador")) {
            let voicechannel;
            let role = message.guild.roles.cache.find(role => role.name === "Teste");
            if (args[0] == "ON") {
                voicechannel = message.guild.channels.cache.get("703253259078467649");
                voicechannel.members.forEach(async function(member) {
                    try {
                        await member.roles.add(role);
                        await member.voice.setChannel("718042084522590258");
                    } catch (error) {
                        console.log(error);
                    }
                });
                console.log(`${message.author.username} ativou o modo de teste.`);
            }
            else if (args[0] == "OFF") {
                voicechannel = message.guild.channels.cache.get("718042084522590258");
                voicechannel.members.forEach(async function(member) {
                    try {
                        await member.voice.setChannel("703253259078467649");
                    } catch (error) {
                        console.log(error);
                    }
                });
                message.guild.members.cache.forEach(async function(member) {
                    await member.roles.remove(role);
                });
                console.log(`${message.author.username} desativou o modo de teste.`);
            }
            else {
                return message.channel.send({
                    "embed": {
                        "title": "Nenhum argumento introduzido",
                        "description": "Para ativar/desativar o modo de teste, utilize o seguinte comando:```$teste ON|OFF```",
                        "color": COLORS.error
                    }
                });
            }

            return message.channel.send({
                "embed": {
                    "title": "Feito!",
                    "description": `Todos os utilizadores de ${voicechannel} foram movidos com sucesso!`,
                    "color": COLORS.default
                }
            })
                .then(msg => {
                    msg.delete({ timeout: 3000 })
                });
        }
        else {
            console.log(`${message.author.username} tentou ativar/desativar o modo de teste.`);
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