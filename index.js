const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	allowedMentions: { parse: ['users', 'roles'] },
});

client.commands = new Collection();
client.slashies = new Collection();

client.config = require('./config.json');

fs.readdirSync('./handlers/').forEach(handler => {
	if (!handler.endsWith('.handler.js')) return;

	require(`./handlers/${handler}`)(client);
});

// start bot
client.login(client.config.token);