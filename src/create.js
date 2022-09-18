const fs = require('fs');
const { dirname } = require('path');
const { exec } = require('shelljs');

const domain = 'teamconcords.com';
const subdomain = 'www';

// configure nginx
exec(`sudo mkdir -p /var/www/${domain}/html`);
exec(`sudo chown -R sam:sam /var/www/${domain}/html`);

function writeFile(path, contents, cb) {
	fs.mkdir(dirname(path), { recursive: true }, function (err) {
		if (err) return cb(err);

		fs.writeFile(path, contents, cb);
	});
}
const createStream = writeFile(
	`/var/www/${domain}/html/index.html`,
	`
<html>
    <head>
        <title>Welcome to ${subdomain}.${domain}!</title>
    </head>
    <body>
        <h1>Success! The ${subdomain}.${domain} server block is working!</h1>
    </body>
</html>
`,
	(e) => {
		console.log(e);
	}
);

writeFile(
	`/etc/nginx/sites-available/${domain}`,
	`
server {
  root /var/www/${domain}/html;
  index index.html index.htm index.nginx-debian.html;

  server_name ${domain} ${subdomain}.${domain};

  location / {
    try_files $uri $uri/ /index.html;
  }
}
server {
  listen 80;
  listen [::]:80;

  server_name ${domain} ${subdomain}.${domain};
}
`,
	(e) => {
		console.log(e);
	}
);

exec(
	`sudo ln -s /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/`
);
exec(`sudo certbot --nginx -d ${domain} -d ${subdomain}.${domain}`);
