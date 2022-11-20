exports.run = async (client) => {
	const guilds = client.guilds.cache.map(guild => guild.name);
	const guild_num = client.guilds.cache.size;
	console.log(`Guilds: ${guilds}`);
	console.log('Ready!');
	client.user.setActivity(`.help | ${guild_num} server` + ((guild_num > 1) ? 's' : ''), { type: 'WATCHING' });
};