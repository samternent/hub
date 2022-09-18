const fs = require('fs');
const { dirname } = require('path');
const { exec, cd, cp, rm } = require('shelljs');
const createSSL = require('./ssl.js');

module.exports = function (repo, subdomain, domain) {
	// configure nginx
	try {
		exec(`sudo rm -rf /var/www/${domain}/html`);
		exec(`sudo rm -rf /etc/nginx/sites-available/${domain}`);
		exec(`sudo rm -rf /etc/nginx/sites-enabled/${domain}`);

		exec(`sudo mkdir -p /var/www/${domain}/html`);
		exec(`sudo chown -R sam:sam /var/www/${domain}/html`);
		exec(`sudo chown -R sam:sam /etc/nginx/sites-available`);
		exec(`sudo chown -R sam:sam /etc/nginx/sites-enabled`);

		function writeFile(path, contents, cb) {
			fs.mkdir(dirname(path), { recursive: true }, function (err) {
				if (err) return cb(err);

				fs.writeFile(path, contents, cb);
			});
		}

		cd(`~/`);
		exec(`rm -rf /${repo.split('/')[1]}`);
		exec(`gh repo clone ${repo}`);
		cd(`~/${repo.split('/')[1]}`);
		exec('pnpm i');
		exec('pnpm build');
		exec(`sudo cp -r dist/ /var/www/${domain}/html/`);

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

		createSSL(subdomain, domain);
	} catch (e) {
		console.log(e);
	}
};
