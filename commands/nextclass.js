const { COLORS } = require("../core/prepare");

module.exports = {
    name: "nextclass",
    description: "Mostra a próxima aula",
    execute(message) {
        var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var returnClass = null;
        var returnCode = NaN;
        if (date.getDay() == 0) {
            returnCode = 1;
        }
        else if (date.getDay() == 1) {
            if (hour <= 8) {
                if (minute < 30)
                    returnClass = "Orientação Educativa";
            }
            else if (hour <= 9) {
                if (minute < 30)
                    returnClass = "Fisico Química";
            }
            else if (hour < 11)
                returnClass = "Programação e Sistemas Informáticos";
            else if (hour < 12)
                returnClass = "Matemática";
            else
                returnCode = 0;
        }
        else if (date.getDay() == 2) {
            if (hour <= 8) {
                if (minute < 30)
                    returnClass = "Português";
            }
            else if (hour < 10)
                returnClass = "Inglês";
            else if (hour <= 11) {
                if (minute < 30)
                    returnClass = "Redes e Computadores";
            }
            else if (hour < 14)
                returnClass = "Área de Integração";
            else if (hour < 15)
                returnClass = "Educação Física";
            else
                returnCode = 0;
        }
        else if (date.getDay() == 3) {
            if (hour <= 8) {
                if (minute < 30)
                    returnClass = "Fisico Química";
            }
            else if (hour <= 9) {
                if (minute < 30)
                    returnClass = "Programação e Sistemas Informáticos";
            }
            else if (hour < 11)
                returnClass = "Inglês";
            else if (hour < 12)
                returnClass = "Redes e Computadores";
            else if (hour < 14)
                returnClass = "Área de Integração";
            else if (hour <= 15) {
                if (minute < 30)
                    returnClass = "Matemática";
            }                
            else
                returnCode = 0;
        }
        else if (date.getDay() == 4) {
            if (hour < 9)
                returnClass = "Matemática";
            else if (hour < 10)
                returnClass = "Programação e Sistemas Informáticos II";
            else if (hour < 12)
                returnClass = "Programação e Sistemas Informáticos";
            else if (hour < 14)
                returnClass = "Português";
            else if (hour < 15)
                returnClass = "Inglês";
            else if (hour < 16)
                returnClass = "Área de Integração";
            else
                returnCode = 0;
        }
        else if (date.getDay() == 5) {
            if (hour <= 8) {
                if (minute < 30)
                    returnClass = "Programação e Sistemas Informáticos II";
            }
            else if (hour < 10)
                returnClass = "Português";
            else if (hour <= 11) {
                if (minute < 30)
                    returnClass = "Arquitetura de Computadores";
            }
            else if (hour < 14)
                returnClass = "Fisico Química";
            else if (hour < 15)
                returnClass = "Programação e Sistemas Informáticos";
            else if (hour < 16)
                returnClass = "Educação Física";
            else
                returnCode = 0;
        }
        else if (date.getDay() == 6) {
            returnCode = 2;
        }

        if (returnClass == null) {
            if (returnCode == 0) {
                returnClass = "Hoje já não há mais aulas.";
            }
            else if (returnCode == 1) {
                returnClass = "Hoje é domingo...";
            }
            else if (returnCode == 2) {
                returnClass = "Hoje é sábado...";
            }
            return message.channel.send({
                "embed": {
                    "title": "Próxima aula",
                    "description": `${returnClass}`,
                    "color": COLORS.default
                }
            });
        }
        else {
            return message.channel.send({
                "embed": {
                    "title": "Próxima aula",
                    "description": `A próxima aula é **${returnClass}**.`,
                    "color": COLORS.default
                }
            });
        }
    }
};