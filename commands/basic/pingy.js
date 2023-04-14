const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingy')
		.setDescription('Replies with Pong2!'),
	async execute(interaction) {
		await interaction.reply('Pong abc!');
	},
};