module.exports = {
	name: 'eval',
	usage: 'eval <expression',
	description: 'Evaluate a .js expression',
	hidden: true,
	async run(client, message, args) {
		if (message.author.id !== client.config.ownerId) return;

		try {
			const evaled = eval(args.join(' '));

			// const cleaned = await clean(client, evaled);

			message.channel.send(`\`\`\`js\n${evaled}\n\`\`\``);
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
		}
	},
};