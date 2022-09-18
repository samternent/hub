const { writeFile } = require('fs');
const { exec } = require('shelljs');

const domain = 'teamconcords.com';
const subdomain = 'www';

// configure nginx
exec(`sudo mkdir -p /var/www/${domain}/html`);
exec(`sudo chown -R sam:sam /var/www/${domain}/html`);
writeFile(
	`/var/www/${domain}/html/index.html`,
	```
<html>
    <head>
        <title>Welcome to FootballSocial.app!</title>
    </head>
    <body>
        <h1>Success! The footballsocial.app server block is working!</h1>
    </body>
</html>
```
);
writeFile(
	`/etc/nginx/sites-available/${domain}`,
	```
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
```
);

exec(
	`sudo ln -s /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/`
);
exec(`sudo certbot --nginx -d ${domain} -d ${subdomain}.${domain}`);
