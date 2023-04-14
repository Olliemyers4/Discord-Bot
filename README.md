# Discord Bot
This discord bot written in JS as a hobby project to try and integrate OpenAI's gpt-3.5-turbo model into a discord bot that can be called using text chat as well as through voice channels.

## Commands
### Slash Commands
#### Basic
- /ping => Replies "pong" (Was just added as part of the discord.js tutorial)
- /pingy => Replies "Pong abc!" (Was just added as part of the discord.js tutorial)
- /reload => Checks to see if you are the owner and if so reloads all events (I don't think this fully works)
- /server => Replies with the guild name and number of members (Was just added as part of the discord.js tutorial)
- /user => Replies with the username of the user and when they joined the guild (Was just added as part of the discord.js tutorial)
#### Voice
- /join-vc => If the user that ran the command is in a voice channel, the bot will join this voice channel
- /leave-vc => If the bot is in a voice channel, it will disconnect
- /speak [Arg] => Converts 'Arg' into speech and plays it in the voice channel the bot is in
- /ai-speak [Arg] => Sends the 'Arg' to the gpt-3.5-turbo model and plays the reply back through the voice channel the bot is in
- /toggle-transcribe => Starts/Stops the transcribing process - If in a voice channel the bot will listen when you talk, transcribe it through OpenAi's whisper and then pass the result to the gpt-3.5-turbo model which then plays the reply back through the voice channel.
### Text Commands
- !toggleAI => If done by the developer, enables the !ai reply
- !ai [Args] => If AI hs been toggled on, sends the args to gpt-3.5-turbo and then replies in chat to the user that typed the command

## Setup
- In order to setup this bot, first clone the repository
- Then create a `config.json` file in the main directory of the project

`config.json` should look like the following:
```json
{

	"token": "INSERT_DISCORD_BOT_TOKEN",
    "clientId": "INSERT_DISCORD_BOT_CLIENT_ID",
    "developerUserId" : "USER_ID_OF_DEVELOPER_USER",
    "aiOrg": "OPEN_AI_ORG_TOKEN",
    "aiKey": "OPEN_AI_API_KEY"

}
```
- Once this is done, you can run `npm install` to install the requiste packages
- In order for slash commands to be recognised used in discord, they first have to be registerd: Running `node deploy-commands.js` will register the commands for all guilds.
- `node .` runs the bot


## Known Issue With Installing
Some users may encounter an error where `@discordjs/opus` can't be found.
To fix this just run `npm install discordjs/opus`

(Only tried this on Windows and Windows Server)