const {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandStringOption,
} = require("discord.js");
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const fs = require("node:fs");
const path = require("path");
let pathToSoundFile;

const createSubcommands = (string, group) => {
  const soundFiles = fs.readdirSync(`src/sounds/${string}`);
  const subcommands = soundFiles.map((file) => {
    return new SlashCommandSubcommandBuilder()
      .setName(path.parse(file).name.toLowerCase())
      .setDescription(`Play`);
  });
  for (const subcommand of subcommands) {
    group.addSubcommand(subcommand);
  }
};
const strongholdCommands = new SlashCommandSubcommandGroupBuilder()
  .setName(`stronghold`)
  .setDescription("Stronghold sounds");
createSubcommands(`stronghold`, strongholdCommands);

const otherCommands = new SlashCommandSubcommandGroupBuilder()
  .setName(`other`)
  .setDescription("Other sounds");
createSubcommands(`other`, otherCommands);

const command = new SlashCommandBuilder()
  .setName("play")
  .setDescription("play sound")
  .addSubcommandGroup(strongholdCommands)
  .addSubcommandGroup(otherCommands);

module.exports = {
  data: command,

  async execute(interaction) {
    let resource;
    const connection = getVoiceConnection(process.env.GUILD_ID);

    if (!connection) {
      interaction.reply("I'm not in any voice channel!");
    } else {
      const player = createAudioPlayer();
      player.on("error", (error) => {
        console.error(
          "Error:",
          error.message,
          "with track",
          error.resource.metadata.title
        );
      });

      try {
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

        resource = createAudioResource(
          `src/sounds/${subcommandGroup}/${subcommand.toLowerCase()}.mp3`,
          {}
        );
        player.play(resource);
        const subscription = connection.subscribe(player);
        interaction.reply("playing!");
      } catch (error) {
        interaction.reply(`It's the wrong command, fool!`);
      }
    }
  },
};
