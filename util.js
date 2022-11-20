const request = require('request');

function shorten(torrents) {
	const endpoint = 'http://mgnet.me/api/create';
	function shorten_one(torrent) {
		return new Promise((resolve) => {
			request({
				url: endpoint,
				method: 'POST',
				form: {
					m: torrent.magnet,
					format: 'json',
				},
			}, (error, response, body) => {
				if (!error) {
					torrent.shortened = JSON.parse(body)['shorturl'];
					resolve(torrent);
				}
			});
		});
	}
	return new Promise((resolve) => {
		const tasks = new Array;
		for (const torrent of torrents) {
			tasks.push(shorten_one(torrent));
		}
		Promise.all(tasks).then((res) => resolve(res));
	});
}

function resolve_torrentapi_redirects(torrents) {
	function resolve_one(torrent) {
		return new Promise((resolve) => {
			request({
				url: torrent.desc + '&app_id=NodeTorrentSearchApi',
				headers: {
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
				},
				followRedirect: false,
			}, (error, response) => {
				if (!error) {
					torrent.desc = response.headers.location;
					console.log(response.headers.location);
					resolve(torrent);
				}
			});
		});
	}
	return new Promise((resolve) => {
		const tasks = new Array;
		for (const torrent of torrents) {
			tasks.push(resolve_one(torrent));
		}
		Promise.all(tasks).then((res) => resolve(res));
	});
}

function capitalizeFirstLetterLowerElse(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

exports.shorten = shorten;
exports.capitalizeFirstLetterLowerElse = capitalizeFirstLetterLowerElse;
exports.resolve_torrentapi_redirects = resolve_torrentapi_redirects;