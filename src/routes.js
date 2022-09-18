const express = require('express');
const bodyParser = require('body-parser');
const createApp = require('./create.js');

const router = express.Router();

router.get('/', function (req, res) {
	res.send('Welcome to the Webhooks API');
});

router.post('/deploy', async function (req, res) {
	const create = (repository, subdomain, domain) =>
		new Promise((resolve, reject) => {
			try {
				createApp(repository, subdomain, domain);
			} catch (e) {
				reject(e);
			}
		});

	const { repository, subdomain, domain } = req.body;
	create(repository, subdomain, domain);
	res.send('Captain Hook');
});

router.post('/create', function (req, res) {
	try {
		const { repository } = req.body;

		console.log(`gh  ${repository}`);
	} catch (e) {
		return res.status(400).send({
			message: e,
		});
	}
	res.send('Captain Hook');
});

module.exports = router;
