const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.get('/', function (req, res) {
	res.send('Welcome to the Webhooks API');
});

router.post('/deploy', function (req, res) {
	try {
		const { repository } = req.body;

		console.log(`cloning ${repository}`);
	} catch (e) {
		return res.status(400).send({
			message: e,
		});
	}
	res.send('Captain Hook');
});

module.exports = router;
