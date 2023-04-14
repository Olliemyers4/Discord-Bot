const gTTS = require('gtts');
const { SlashCommandBuilder} = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { createAudioPlayer, createAudioResource, AudioPlayerStatus  } = require('@discordjs/voice');
const path = require('node:path');
const fs = require('fs');


const player = createAudioPlayer();

var transcribing = false

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle-transcribe')
		.setDescription('Toggles transcribing'),
    
	async execute(interaction) {

        await interaction.deferReply({ ephemeral: true});

        if(transcribing){
            await stopTranscribing(interaction);
            console.log('Stopped Transcribing');
        }else{
            await startTranscribing(interaction);
            console.log("Started Transcribing");
        }
        transcribing = !transcribing;
    }
}

async function startTranscribing(interaction){
    const guild = interaction.guild;
    const connection =  getVoiceConnection(interaction.guild.id);
    const receiver = connection.receiver;
    receiver.speaking.on('start', onStart);
    receiver.speaking.on('end', onStop);
    interaction.editReply({content: 'Started Transcribing', ephemeral: true});

}

async function stopTranscribing(interaction){
    const guild = interaction.guild;
    const connection =  getVoiceConnection(interaction.guild.id);
    const receiver = connection.receiver;
    receiver.speaking.removeAllListeners();
    connection.destroy();
    interaction.editReply({content: 'Started Transcribing', ephemeral: true});

}

async function onStart(userId){
    console.log('Started speaking', userId);
}
async function onStop(userId){
    console.log('Stopped speaking', userId);
}


