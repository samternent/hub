#!/bash/bash

REPOSITORY="$1"
SUBDOMAIN="$2"
DOMAIN="$3"

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

sudo touch /etc/nginx/sites-available/${DOMAIN}
sudo tee -a /etc/nginx/sites-available/${DOMAIN} > /dev/null <<EOT
server {
  root /var/www/${DOMAIN}/html;
  index index.html index.htm index.nginx-debian.html;

  server_name ${DOMAIN} ${SUBDOMAIN}.${DOMAIN};

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
server {
  listen 80;
  listen [::]:80;

  server_name ${DOMAIN} ${SUBDOMAIN}.${DOMAIN};
}
EOT

sudo ln -s /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/

echo 1 | sudo certbot --nginx -d ${DOMAIN} -d ${SUBDOMAIN}.${DOMAIN}

sudo systemctl restart nginx