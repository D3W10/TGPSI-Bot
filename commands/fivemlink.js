const { CUTTLY_API, COLORS } = require("../core/prepare");
const fetch = require("node-fetch");

module.exports = {
    name: "fivemlink",
    description: "Põe os links do FiveM numa mensagem embed.",
    hidden: 1,
    channel: ["❰🚗❱-five-m", "❰🍺❱-bar"],
    async execute(message) {
        message.delete();
        let URI = message.content.match(/(?<=cfx\.re\/join\/)(.*)/g)[0], content;
        if (message.content.startsWith("connect"))
            content = message.content;
        else
            content = "connect " + message.content;
        URI = encodeURI("fivem://connect/" + URI);
        let shortURI = await fetch(`https://cutt.ly/api/api.php?key=${CUTTLY_API}&short=${URI}`, {
            method: "GET"
        });
        shortURI = await shortURI.json();
        console.log(`${message.author.username} enviou um link do FiveM (${content})!`);
        return message.channel.send({
            "embed": {
                "title": "FiveM",
                "description": `Entre neste lindo servidor de FiveM!\`\`\`${content}\`\`\`\n[Entrar agora!](${shortURI.url.shortLink})`,
                "color": COLORS.fivem,
                "author": {
                    "name": `${message.author.username}`,
                    "icon_url": `${message.author.avatarURL()}`
                },
                "thumbnail": {
                    "url": "https://i.imgur.com/bTGHcYP.png"
                }
            }
        });
    }
};