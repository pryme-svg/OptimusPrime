// const { capitalizeFirstLetterLowerElse } = require('../../util');

module.exports = {
	name: 'help',
	usage: 'help <command>',
	description: 'Show bot information and commands',
	async run(client, message, args) {
		const embed = {
			color: 0x4b0082,
			title: 'Help',
		};

		// default help || temp cuz i don't have command specific
		if (!args[0]) {
			const commands = {};
			for (const command of client.commands.values()) {
				if (command.hidden == true) continue;

				if (commands[command.category] === undefined) {
					commands[command.category] = new Array;
					commands[command.category].push({
						name: command.name,
						description: command.description,
					});
				}
				else {

					commands[command.category].push({
						name: command.name,
						description: command.description,
					});
				}
			}
			let complete_desc = `Use \`${client.config.prefix}help <command>\` for more info\n`;
			for (const cat in commands) {
				const category = cat;
				const cat_commands = commands[cat];
				let cat_desc = `**${category}**\n`;
				for (const cmd of cat_commands) {
					const name = cmd['name'];
					const desc = cmd['description'];
					cat_desc += `• ${name} - ${desc}\n`;
				}
				complete_desc += cat_desc;
			}
			embed.description = complete_desc;

			message.channel.send({
				embeds: [embed],
			});
		}
		else {
			const query = args[0];
			if (client.commands.get(query) !== undefined) {
				const command = client.commands.get(query.toLowerCase());
				const msg_embed = {
					color: 0xfff,
					title: command.name,
					description: `${command.description}\nUsage: \`${client.config.prefix}${command.usage}\``,
				};
				message.channel.send({
					embeds: [msg_embed],
				});
				return;
			}
			// category info
			// if (client.categories.includes(capitalizeFirstLetterLowerElse(query))) {
			// 	const category = capitalizeFirstLetterLowerElse(query);
			// }
			const msg_embed = {
				color: 0xd63600,
				description: `:x: Command "${query}" not found`,
			};
			message.channel.send({
				embeds: [msg_embed],
			});
		}
	},
};