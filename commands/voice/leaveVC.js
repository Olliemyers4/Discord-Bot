const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave-vc')
		.setDescription('leaves VC'),
	async execute(interaction) {
        try{
            const connection =  getVoiceConnection(interaction.guild.id);
            connection.destroy();
            await interaction.reply( {content:'Left VC!', ephemeral: true });
        }catch(err){
            await interaction.reply( {content:'I am not in a VC!', ephemeral: true });
        }
	}
};