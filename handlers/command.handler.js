const fs = require('fs');

module.exports = async client => {
	const categories = new Array;
	fs.readdirSync('./commands/').forEach(dir => {
		categories.push(dir);
		fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js')).forEach(file => {
			const command = require(`../commands/${dir}/${file}`);
			command.category = dir;

			client.commands.set(command.name, command);

			if (command.slash) {
				client.slashies.set(command.name, command);
			}
		},
		);
	});
	client.categories = categories;

};
