const { SlashCommandBuilder } = require('discord.js');
const { developerUserId } = require('../../config.json');
const fs = require('node:fs');
const path = require('node:path');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload-bot')
		.setDescription('Reloads all commands and Events'),
	async execute(interaction) {
		if (interaction.user.id !== developerUserId) {
			await interaction.reply('You are not the developer of this bot!');
			return;
		}else{
			const client = interaction.client;
			// Read all the files in the commands directory and add them to the client.commands collection
			const foldersPath = path.join(__dirname, '../');

			const commandFolders = fs.readdirSync(foldersPath);

			for (const folder of commandFolders) {
				const commandsPath = path.join(foldersPath, folder);
				const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					const filePath = path.join(commandsPath, file);
					const command = require(filePath);
					// Set a new item in the Collection with the key as the command name and the value as the exported module
					if ('data' in command && 'execute' in command) {
						await client.commands.set(command.data.name, command);
					} else {
						console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
					}
				}
			}

			//Do the same for events
			const eventsPath = path.join(__dirname, '../../events');
			const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

			client.removeAllListeners();

			for (const file of eventFiles) {
				const filePath = path.join(eventsPath, file);
				const event = require(filePath);
				if (event.once) {
					await client.once(event.name, (...args) => event.execute(...args));
				} else {
					await client.on(event.name, (...args) => event.execute(...args));
				}
			}
			await interaction.reply('Reloaded all commands and events!');
			return;
		}
		
	},
};