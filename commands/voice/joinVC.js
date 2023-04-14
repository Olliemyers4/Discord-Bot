const { SlashCommandBuilder, Guild } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { memcmp } = require('libsodium-wrappers');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('join-vc')
		.setDescription('Joins your current VC'),
	async execute(interaction) {
        try{
            const guild = interaction.guild;
            const user = interaction.user;
            const member = await guild.members.fetch(user.id)
                .then(member => {
                    return member;
                }).catch(console.error)
            const voiceState = member.voice;
            const channel = voiceState.channelId;
     

            
            const connection =  joinVoiceChannel({
                channelId: channel,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: false,
            });
            

            await interaction.reply({content:'Joined VC!' ,ephemeral: true });
        }catch(err){
            await interaction.reply({content: 'You are not in a VC!', ephemeral: true });
        }
	}
};