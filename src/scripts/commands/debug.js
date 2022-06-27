const { Client, RichEmbed, Message, MessageEmbed } = require('discord.js');
module.exports = {
    pong: function (interaction) {
        let latency = (Date.now() - interaction.createdTimestamp)*2

        const embed = new MessageEmbed()
            .setTitle('Pong')
            .setDescription(latency.toString() + ' ms latency')
            .setColor(0xcc0000)
            .setTimestamp();

        return embed;
    },
    error: async function (content, error) {
        const embed = new MessageEmbed()
            .setTitle(':no_entry_sign: An Error Occured :no_entry_sign: ')
            .setColor(0xcc0000)
            .setDescription(':rotating_light: ' + content + ' :')
            .setTimestamp()
            .addFields(
                { name: 'Error :', value: error.stack + ' || ' + error }
            );

        return embed;
    },
    h_error: function (content, error) {
        const embed = new MessageEmbed()
            .setTitle(':no_entry_sign: An Error Occured :no_entry_sign: ')
            .setColor(0xcc0000)
            .setDescription(':rotating_light: ' + content + ' :')
            .setTimestamp()
            .addFields(
                { name: 'Error :', value: error}
            );

        return embed;
    }
}