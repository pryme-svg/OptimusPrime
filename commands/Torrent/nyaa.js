const torrentApi = require('torrent-search-api');
const { shorten } = require('../../util');

module.exports = {
	name: 'nyaa',
	usage: 'nyaa <query>',
	description: 'Fetch torrents from Nyaa.si',
	async run(client, message, args) {
		if (args.length == 0) {
			const embed = {
				color: 0xd63600,
				description: ':x: Please supply a query',
			};
			message.channel.send({
				embeds: [embed],
			});
			return;
		}
		message.channel.sendTyping();
		torrentApi.enableProvider('Nyaa');
		const torrents = (await torrentApi.search(['Nyaa'], args.join(' '))).slice(0, 5);
		if (torrents.length == 0) {
			const embed = {
				color: 0xd63600,
				description: ':x: Query not found',
			};
			message.channel.send({
				embeds: [embed],
			});
			return;
		}
		const shortened = await shorten(torrents);
		const fields = new Array;
		// only 5 torrents
		shortened.map((torrent) => {
			const desc = `**[magnet](${torrent.shortened})** | **[nyaa](${torrent.desc})** | Seeds: ${torrent.seeds} | Leeches: ${torrent.peers} | Size: ${torrent.size}`;
			fields.push({
				name: torrent.title,
				value: desc,
			});
		});

		const embed = {
			color: 0x0084ff,
			author: {
				name: message.author.username,
				icon_url: message.author.avatarURL(),
			},
			fields: fields,
			timestamp: new Date(),
		};

		message.channel.send({ embeds: [embed] });

	},
};