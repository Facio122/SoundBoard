const {SlashCommandBuilder} = require(`discord.js`);
const {joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, NoSubscriberBehavior, createAudioResource} = require(`@discordjs/voice`)
const { createReadStream } = require('node:fs');
const { join } = require('node:path');


module.exports = 
{
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join to voice channel'),

        async execute(interaction)
        {
            const myChannel = interaction.member.voice.channel.id;
            console.log(myChannel);

            const connection = joinVoiceChannel(
                {
                    channelId: myChannel,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                }
            );

            connection.on(VoiceConnectionStatus.Ready, () =>{
                const player = createAudioPlayer(
                    {
                        behaviors:
                        {
                            noSubscriber: NoSubscriberBehavior.Pause,
                        },
                    }
                );
                const audioResource = createAudioResource(join(__dirname, 'Swords-and-Sandals-2-Sound-files-compiled.mp3'));
                player.play(audioResource);

                const subscription = connection.subscribe(player)
            });

            interaction.reply(`Kali bot joined to ${interaction.member.voice.channel.name}`);
        }
}