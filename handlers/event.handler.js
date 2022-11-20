const { readdirSync } = require('fs');

module.exports = async client => {

	readdirSync('./events/').filter(f => f.endsWith('.js')).forEach(evnt => {

		const event = require(`../events/${evnt}`);
		console.log(`Event Loaded ${evnt.split('.')[0]}`);

		client.on(evnt.split('.')[0], (...args) => event.run(client, ...args));
	});
};