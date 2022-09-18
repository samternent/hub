const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('shelljs');

const router = express.Router();

router.get('/', function (req, res) {
	res.send('Welcome to the Webhooks API');
});

router.post('/deploy', async function (req, res) {
	try {
		const { repository, subdomain, domain } = req.body;
		exec(`bash src/create.sh ${repository} ${subdomain} ${domain}`);
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
