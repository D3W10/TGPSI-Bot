const { COLORS } = require("../core/prepare");

module.exports = {
    name: "nickname",
    description: "Avisa utilizadores com nickname impróprio ou não permitido.",
    hidden: 1,
    execute(message, args) {
        message.delete();
        if (message.member.roles.cache.some(role => role.name === "Criador")) {
            if (args[0] == undefined) {
                return message.channel.send({
                    "embed": {
                        "title": "Nenhum nome de utilizador foi introduzido",
                        "description": "Para avisar alguém sobre o nickname, utilize o seguinte comando:```$nickname @UTILIZADOR```",
                        "color": COLORS.error
                    }
                });
            }
            var userID = message.content.match(/<@![\d]+>/g);
            userID = userID[0].replace("<@!", "");
            userID = userID.replace(">", "");
            try {
                var userObj = message.guild.member(message.guild.members.cache.get(userID));
                var userName = userObj.user.username;
                userObj.setNickname(userName, "Impróprio ou não permitido");
                return userObj.send({
                    "embed": {
                        "title": "Aviso",
                        "description": "O nickname posto é impróprio ou não é permitido no servidor. O seu nickname voltou ao seu nome normal.",
                        "color": COLORS.alert
                    }
                });
            }
            catch (error) {
                return message.channel.send({
                    "embed": {
                        "title": "Erro!",
                        "description": `Um erro ocorreu ao tentar avisar esse utilizador:\`\`\`${error.message}\`\`\``,
                        "color": COLORS.error
                    }
                });
            }
        }
        else {
            console.log(`${message.author.username} tentou avisar ${userObj.username} que o seu nickname era impróprio ou não permitido.`);
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