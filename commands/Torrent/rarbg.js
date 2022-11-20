const torrentApi = require('torrent-search-api');
const { shorten } = require('../../util');

module.exports = {
	name: 'rarbg',
	usage: 'rarbg <query>',
	description: 'Fetch torrents from RARBG',
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
		torrentApi.enableProvider('Rarbg');
		try {
			let torrents = (await torrentApi.search(['Rarbg'], args.join(' '))).slice(0, 5);
		
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
			torrents = await shorten(torrents);
			// broken because API limit 1 req / 2s
			// torrents = await resolve_torrentapi_redirects(torrents);
			const fields = new Array;
			// only 5 torrents
			torrents.map((torrent) => {
				const desc = `**[magnet](${torrent.shortened})** | Seeds: ${torrent.seeds} | Leeches: ${torrent.peers} | Size: ${torrent.size}`;
				// const desc = `**[magnet](${torrent.shortened})** | **[rarbg](${torrent.desc})** | Seeds: ${torrent.seeds} | Leeches: ${torrent.peers} | Size: ${torrent.size}`;
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
			} catch(err) {
				const embed = {
				color: 0xd63600,
				description: `:x: ${err.toString()}`,
				author: {
					name: message.author.username,
					icon_url: message.author.avatarURL(),
				},
				timestamp: new Date(),
				footer: {
					text: 'Please try again',
				}
			};

			message.channel.send({embeds: [embed]});
			}
		

	},
};

