const { SlashCommandBuilder } = require(`discord.js`);
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
} = require(`@discordjs/voice`);
const { createReadStream } = require("node:fs");
const { join } = require("node:path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join to voice channel"),

  async execute(interaction) {
    if (interaction.member.voice.channel) {
      const myChannel = interaction.member.voice.channel.id;
      const connection = joinVoiceChannel({
        channelId: myChannel,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      interaction.reply(
        `Kali bot joined to ${interaction.member.voice.channel.name}`
      );
    } else {
      interaction.reply(`You need join to voice channel!`);
    }
  },
};
