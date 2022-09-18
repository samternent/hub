#!/bash/bash

REPOSITORY="concords/teamconcords"
SUBDOMAIN="www"
DOMAIN="teamconcords.com"

sudo chown -R sam:sam /var/www/${DOMAIN}/html
sudo chown -R sam:sam /etc/nginx/sites-available
sudo chown -R sam:sam /etc/nginx/sites-enabled

sudo rm -rf /var/www/${DOMAIN}/html
sudo rm -rf /etc/nginx/sites-available/${DOMAIN}
sudo rm -rf /etc/nginx/sites-enabled/${DOMAIN}

sudo mkdir -p /var/www/${DOMAIN}/html

cd ~/

IFS=/ read -r ORG REPO <<< ${REPOSITORY}
rm -rf ${REPO}

gh repo clone ${REPOSITORY}
cd ~/${REPO}
pnpm i
pnpm build

sudo cp -r dist/* /var/www/${DOMAIN}/html
sudo sed -e "s/\${domain}/$DOMAIN/" -e "s/\${subdomain}/$SUBDOMAIN/" ./src/nginx.conf ${DOMAIN}

sudo touch /etc/nginx/sites-available/${DOMAIN}
sudo tee -a /etc/nginx/sites-available/${DOMAIN} > /dev/null <<EOT
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
EOT