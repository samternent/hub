const pkg = require('../package.json');
const Greenlock = require('greenlock');

module.exports = function (subdomain, domain) {
	const greenlock = Greenlock.create({
		configDir: './greenlock.d/config.json',
		packageAgent: pkg.name + '/' + pkg.version,
		maintainerEmail: pkg.author,
		staging: true,
		notify: function (event, details) {
			if ('error' === event) {
				// `details` is an error object in this case
				console.error(details);
			}
		},
	});
	greenlock.manager
		.defaults({
			agreeToTerms: true,
			subscriberEmail: 'sam.ternent@gmail.com',
		})
		.then(function (fullConfig) {
			// ...
		});
	var altnames = [domain, `${subdomin}.${domain}`];

	greenlock
		.add({
			subject: altnames[0],
			altnames: altnames,
		})
		.then(function () {
			// saved config to db (or file system)
		});
	greenlock
		.get({ servername: subject })
		.then(function (pems) {
			if (pems && pems.privkey && pems.cert && pems.chain) {
				console.info('Success');
			}
			//console.log(pems);
		})
		.catch(function (e) {
			console.error('Big bad error:', e.code);
			console.error(e);
		});
};
