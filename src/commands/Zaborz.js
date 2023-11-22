const { SlashCommandBuilder } = require(`discord.js`);
const fs = require(`fs`);

fs.readFile(`src/Zaborz_definition.txt`, "utf8", (err, data) => {
  if (err) throw err;
  string = data.toString();
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`zaborz`)
    .setDescription(`Who is Zaborz`),

  async execute(interaction) {
    await interaction.reply(string);
  },
};
