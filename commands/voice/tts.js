const gTTS = require('gtts');
const { SlashCommandBuilder} = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { createAudioPlayer, createAudioResource, AudioPlayerStatus  } = require('@discordjs/voice');
const path = require('node:path');

const player = createAudioPlayer();



module.exports = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('Says what you want in VC')
        .addStringOption(option => option.setName('input').setDescription('What you want me to say').setRequired(true)),
	async execute(interaction) {
        try{
            await interaction.deferReply({ ephemeral: true});
            console.log(interaction.options.getString('input'));

            const  gtts = new gTTS(interaction.options.getString('input'), 'en');
    
            gtts.save('voice.mp3', async function (err, result) {
                if (err) { throw new Error(err); }
                //console.log("Text to speech converted!");
                const connection =  getVoiceConnection(interaction.guild.id);
                const subscription = connection.subscribe(player);
                const resource = createAudioResource(path.join(__dirname, '../../voice.mp3'), { inputType: 'mp3' ,volume: 1});
                player.play(resource);
    
      
    
                await interaction.editReply( {content:'Playing', ephemeral: true });
            });
            
   
        }catch(err){
            await interaction.editReply( {content:'I am not in a VC!', ephemeral: true });
            //console.log(err);
        }
	}
};


