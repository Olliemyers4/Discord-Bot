const gTTS = require('gtts');
const { SlashCommandBuilder} = require('discord.js');
const { getVoiceConnection, EndBehaviorType } = require('@discordjs/voice');
const { createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const path = require('node:path');
const fs = require('node:fs');
const wavConverter = require('wav-converter')

const { aiKey,aiOrg,} = require('../../config.json');
const { Configuration, OpenAIApi } = require("openai");
const { OpusEncoder } = require('@discordjs/opus');

const configuration = new Configuration({
    organization: aiOrg,
    apiKey: aiKey,
});
const openai = new OpenAIApi(configuration);



const player = createAudioPlayer();

var transcribing = false
const streams = new Map();

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
    receiver.speaking.on('start', async (user) => {
        try{
            fs.unlinkSync(`./recordings/${user}.pcm`);
        }catch(err){
            console.log("No file to delete");
        }
        const audioReceiver = receiver.subscribe(user, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 1000,
            },
        });


        const encoder = new OpusEncoder(48000,2);
        audioReceiver.on('data', (data) => {
            const decoded = encoder.decode(data);
            fs.appendFileSync(`./recordings/${user}.pcm`, decoded);
        });

        audioReceiver.on('end',async () => {
            var pcmData = fs.readFileSync(`./recordings/${user}.pcm`);
            var wavData = wavConverter.encodeWav(pcmData, {
                numChannels: 2,
                sampleRate: 48000,
                byteRate: 192000,
            })
             
            fs.writeFileSync(`./recordings/${user}.wav`, wavData);
            const audioText = await transcribeAudio(user);


            const reply = await callOpenAI(audioText);

            const  gtts = new gTTS(reply, 'en');
    
            gtts.save('voice.mp3', async function (err, result) {
                if (err) { throw new Error(err); }
                //console.log("Text to speech converted!");
                const playerSub = connection.subscribe(player);
                const resource = createAudioResource(path.join(__dirname, '../../voice.mp3'), { inputType: 'mp3' ,volume: 1});
                player.play(resource);
            });


        });






    });
    receiver.speaking.on('end', async (user) => {
        return;

    });
    interaction.editReply({content: 'Started Transcribing', ephemeral: true});


}

async function stopTranscribing(interaction){
    const guild = interaction.guild;
    const connection =  getVoiceConnection(interaction.guild.id);
    const receiver = connection.receiver;
    receiver.speaking.removeAllListeners('start');
    receiver.speaking.removeAllListeners('end');
    interaction.editReply({content: 'Stopped Transcribing', ephemeral: true});

}


async function transcribeAudio(user){
    const resp = await openai.createTranscription(
        fs.createReadStream(`./recordings/${user}.wav`),
        "whisper-1"
      );
        
    return resp.data.text;
}

async function callOpenAI(message){
	console.log(message)
	var fails = 0;
	while (fails < 5){
		try{
			messages.push({"role": "user", "content":message})
			const completion = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: messages,
			})
			reply = completion.data.choices[0].message
			messages.push(reply)
			return reply.content

		}catch(e){
			console.log("Reseting messages")
			messages = baseMessage
			fails += 1
		}
	}
	return "I'm sorry, I'm having trouble thinking right now :( "

}