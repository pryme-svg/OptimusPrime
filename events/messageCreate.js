const request = require('request');

const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const regex = new RegExp(expression);

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function unamp(link) {
	return new Promise((resolve, reject) => {
		// AMP Links
		const url = new URL(link);
		if (url.pathname.startsWith('/amp') && url.hostname.split('.').at(-2) == 'google') {
			request({
				followAllRedirects: true,
				url: url,
			}, (error, response) => {
				if (error) {
					reject(error);
				}
				else {
					resolve(response.request.uri.href);
				}
			});
		}
		else {
			// don't do anything if not amp
			resolve(null);
		}
	});
}

function unredirect(link) {
	return new Promise((resolve) => {
		// Google redirects
		const url = new URL(link);
		if (url.pathname.startsWith('/url') && url.hostname.split('.').at(-2) == 'google') {
			const res = url.searchParams.get('url');
			resolve(res);
			// res may be null
		}
		else {
			resolve(null);
		}
	});
}

exports.run = async (client, message) => {
	if (client.config.blockedUsers.includes(message.author.id)) return;

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.config.prefix)})\\s*`);

	if (prefixRegex.test(message.content) && !message.author.bot) {
		const [, matchedPrefix] = message.content.match(prefixRegex);
		const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		const command_name = args.shift().toLowerCase();
		const command = client.commands.get(command_name);
		if (!command) return;

		await command.run(client, message, args);
	}
	else {
		const links = message.content.match(regex);
		// if no matches
		if (links == null) return;

		// AMP
		const processed_amp_urls = new Array;

		for (const link of links) {
			const res = await unamp(link);
			if (res !== null) processed_amp_urls.push(res);
		}

		if (processed_amp_urls.length != 0) {
			const embed = {
				color: 0x1793d1,
				title: 'Non AMP Links',
				author: {
					name: message.author.username,
					icon_url: message.author.avatarURL(),
				},
				description: processed_amp_urls.join('\n'),
			};
			message.reply({
				embeds: [embed],
			});
		}

		// Google Redirects
		const processed_goog_urls = new Array;
		console.log(links);
		for (const link of links) {
			const res = await unredirect(link);
			if (res !== null) processed_goog_urls.push(res);
		}

		if (processed_goog_urls.length != 0) {
			const embed = {
				color: 0x1793d1,
				title: 'Un-Googlified Links',
				author: {
					name: message.author.username,
					icon_url: message.author.avatarURL(),
				},
				description: processed_goog_urls.join('\n'),
			};
			message.reply({
				embeds: [embed],
			});
		}

	}
};