module.exports = {
	name: 'prefix',
	usage: 'prefix',
	description: 'Get bot prefix',
	async run(client, message) {
		message.reply(`you can either ping me or use \`${client.config.prefix}\` as my prefix.`);
	},
};