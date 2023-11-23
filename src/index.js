const fs = require("node:fs");
const path = require("node:path");

const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { getVoiceConnection } = require(`@discordjs/voice`);
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

let timeout;

client.once(Events.ClientReady, (c) => {
  initCommands();
  console.log(`Client is ready as ${c.user.tag}`);
});

client.login(process.env.TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  client.on(Events.MessageCreate, (message) => {
    clearTimeout(timeout);
    console.log(`ping`);
    timeout = setTimeout(() => {
      console.log("Bot is AFK for 5 minutes. Disconneting...");
      const connection = getVoiceConnection(process.env.GUILD_ID);
      connection.destroy();
    }, 300000);
  });

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

const initCommands = () => {
  console.log(`Initializing slash commands...`);
  client.commands = new Collection();

  const folderpath = path.join(__dirname, "commands");
  const commandFolder = fs.readdirSync(folderpath);

  for (const file of commandFolder) {
    const filePath = path.join(folderpath, file);
    const command = require(filePath);
    console.log(`Initializing ${file} command`);
    if (`data` in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
  console.log(`Done initialize slash commands!`);
};
