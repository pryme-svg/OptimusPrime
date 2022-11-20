const { Formatters } = require('discord.js');

module.exports = {
	name: 'ban',
	usage: 'ban <id|username|mention>',
	description: 'Ban members',
	async run(client, message, args) {
		if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('You do not have permissons to ban');
		//                     fetch from cache               ||      get first mention           ||            get from username                                                                   ||    as last resort fetch from dc
		const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLowerCase()) || await message.guild.members.fetch(args[0]);
		if (!user) return message.channel.send('Unable to find user to ban');

		const banReason = args.slice(1).join(' ');
		message.guild.members.ban(user, {
			days: 0,
			reason: banReason,
		})
			.catch((err) => {return message.channel.send(String(err));})
			.then(message.channel.send(`Banned ${Formatters.userMention(user.id)}(${user.id})`));

	},
};