server {
  root /var/www/teamconcords.com/html;
  index index.html index.htm index.nginx-debian.html;

  server_name teamconcords.com www.teamconcords.com;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
server {
  listen 80;
  listen [::]:80;

  server_name teamconcords.com www.teamconcords.com;
}