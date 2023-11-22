const { SlashCommandBuilder } = require(`discord.js`);
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
} = require(`@discordjs/voice`);
const fs = require(`node:fs`);
const path = require("path");

const mapCommands = () => {
  const soundFiles = fs.readdirSync(`src/sounds`);
  const subcommands = soundFiles.map((file) => {
    return (command) => command.setName(path.parse(file).name);
  });
  return subcommands;
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play sound")
    .addSubcommands(mapCommands),

  async execute(interaction) {
    let resource;
    const connection = getVoiceConnection(process.env.GUILD_ID);

    if (!connection) {
      interaction.reply("I'm not in a any voice channel!");
    } else {
      const player = createAudioPlayer();
      // An AudioPlayer will always emit an "error" event with a .resource property
      player.on("error", (error) => {
        console.error(
          "Error:",
          error.message,
          "with track",
          error.resource.metadata.title
        );
      });
      try {
        //resource = createAudioResource('src/sounds/Gladiator.mp3', {});
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
          case "intro":
            resource = createAudioResource(
              "src/sounds/SwordAndSandalsIntro.mp3",
              {}
            );
            break;
          case "gladiator":
            resource = createAudioResource("src/sounds/Gladiator.mp3", {});
            break;

          default:
            resource = createAudioResource("src/sounds/Gladiator.mp3", {});
            break;
        }
        player.play(resource);

        const subscription = connection.subscribe(player);

        interaction.reply("playin!");
      } catch (error) {
        interaction.reply(`It's the wrong command fool!`);
      }
    }
  },
};
