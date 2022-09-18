const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('shelljs');

const router = express.Router();

router.get('/', function (req, res) {
	res.send('Welcome to the Webhooks API');
});

router.post('/deploy', async function (req, res) {
	try {
		const { repository, subdomain, domain, type, port } = req.body;
		if (type === 'static') {
			exec(`bash ~/src/create-static.sh ${repository} ${subdomain} ${domain}`);
		}
		if (type === 'static') {
			exec(
				`bash ~/src/create-server.sh ${repository} ${subdomain} ${domain} ${port}`
			);
		}
	} catch (e) {
		return res.status(400).send({ message: e });
	}
	return res.send('Captain Hook');
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
