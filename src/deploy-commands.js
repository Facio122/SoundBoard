const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

console.log(`Initializing slash commands...`)
const commands = [];

const folderpath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(folderpath);

    for (const file of commandFolder)
    {
        const filePath = path.join(folderpath, file);
        const command = require(filePath);
        console.log(`Initializing ${file} command`);
        if(`data` in command && 'execute' in command)
        {
            commands.push(command.data.toJSON());
        }
        else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
console.log(`Done initialize slash commands!`);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();