const { canModifyQueue, COLORS } = require("../core/prepare");

module.exports = {
    check(message, member) {
        if (member == undefined) {
            let verify = canModifyQueue(message.member);

            if(verify == 0)
                return true;
            else if (verify == 1) {
                console.log(`${message.author.username} tentou mexer na música mas não estava no Canal de Voz.`);
                message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": "Precisas de estar no mesmo canal que o TGPSI Bot para realizar essa operação.",
                        "color": COLORS.error,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        }
                    }
                })
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    });
                return false;
            }
            else if (verify == 2) {
                console.log(`${message.author.username} tentou mexer na música mas não tem a role de DJ.`);
                message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": "Não tens permissão para fazer essa operação, precisas da role <@&703253258306584695>",
                        "color": COLORS.error,
                        "author": {
                            "name": `${message.author.username}`,
                            "icon_url": `${message.author.avatarURL()}`
                        }
                    }
                })
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    });
                return false;
            }
        }
        else {
            let verify = canModifyQueue(member);
            if(verify == 0)
                return true;
            else if (verify == 1) {
                console.log(`${message.author.username} tentou retomar/pausar/parar/passar/repetir/silenciar/dessilenciar a música mas não estava no Canal de Voz.`);
                message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": "Precisas de estar no mesmo canal que o TGPSI Bot para realizar essa operação.",
                        "color": COLORS.error,
                        "author": {
                            "name": `${member.user.username}`,
                            "icon_url": `${member.user.avatarURL()}`
                        }
                    }
                })
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    });
                return false;
            }
            else if (verify == 2) {
                console.log(`${message.author.username} tentou retomar/pausar/parar/passar/repetir/silenciar/dessilenciar a música mas não tem a role de DJ.`);
                message.channel.send({
                    "embed": {
                        "title": "Erro",
                        "description": "Não tens permissão para fazer essa operação, precisas da role <@&703253258306584695>",
                        "color": COLORS.error,
                        "author": {
                            "name": `${member.user.username}`,
                            "icon_url": `${member.user.avatarURL()}`
                        }
                    }
                })
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    });
                return false;
            }
        }
    }
};