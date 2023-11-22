const {SlashCommandBuilder} = require(`discord.js`);
const {getVoiceConnection} = require(`@discordjs/voice`)
require('dotenv').config();

module.exports = 
{
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect from voice channel'),

        async execute(interaction)
        {
            const connection = getVoiceConnection(process.env.GUILD_ID);
            if(!connection)
            {
                interaction.reply("I'm not in a any voice channel!");
            }
            else
            {
                connection.destroy();
                interaction.reply(`Kali bot disconnect from voice channel`);
            } 
        }
}