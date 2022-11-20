module.exports = {
	name: 'ping',
	usage: 'ping',
	description: 'Get bot latency',
	async run(client, message) {
		const msg = await message.channel.send({ embeds:[{
			color: 0x1e143b,
			thumbnail:{
				url: 'https://cdn.discordapp.com/emojis/786661451385274368.gif?v=1',
			},
		}] });
		msg.edit({ embeds:[{
			title: '🏓 Pong!',
			description: `Websocket: ${client.ws.ping}ms\nAPI: ${msg.createdTimestamp - message.createdTimestamp}ms`,
			color: 0x1e143b,
		}] });
	},
};
