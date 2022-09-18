#!/bash/bash

REPOSITORY="concords/teamconcords"
SUBDOMAIN="www"
DOMAIN="teamconcords.com"

chown -R sam:sam /var/www/${DOMAIN}/html
chown -R sam:sam /etc/nginx/sites-available
chown -R sam:sam /etc/nginx/sites-enabled

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
sudo sed -e "s/\${domain}/$DOMAIN/" -e "s/\${subdomain}/$SUBDOMAIN/" nginx.conf