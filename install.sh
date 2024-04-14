#!/bin/bash

sudo chmod 755 $(pwd)

curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt update
sudo apt install nginx python3.7 python3-distutils python3-apt redis -y

curl https://bootstrap.pypa.io/get-pip.py | python3.7
export PATH="$HOME/.local/bin:$PATH"
echo "export PATH=${HOME}/.local/bin:${PATH}" >> ~/.bashrc

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
source ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm install 16
nvm use 16

echo $PATH
pip3.7 install -r config_files/requirements.txt

sed "s/USER_VAR/$USER/" config_files/main.service_template > config_files/main.service
sed -i "s|CURRDIR|$(pwd)|" config_files/main.service
sed -i "s|GUNICORNDIR|$(whereis gunicorn | cut -d' ' -f2)|" config_files/main.service

sed "s|CURRDIR|$(pwd)|" config_files/nginx_sites_available_template > config_files/nginx_sites_available

cd web-app
npm install
npm run build
cd ../

sudo mkdir -p /etc/nginx/build
sudo cp -r web-app/build/* /etc/nginx/build/

sudo cp config_files/main.service /etc/systemd/system
sudo cp config_files/nginx_sites_available /etc/nginx/sites-available
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default

sudo ln -s /etc/nginx/sites-available/nginx_sites_available /etc/nginx/sites-enabled

sudo systemctl start main
sudo systemctl enable main

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
sudo openssl dhparam -out /etc/nginx/dhparam.pem 4096

sudo cp config_files/signed.conf /etc/nginx/snippets/self-signed.conf
sudo cp config_files/params.conf /etc/nginx/snippets/ssl-params.conf


sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo ufw allow 'OpenSSH'

sudo nginx -t
sudo systemctl restart nginx
sudo /etc/init.d/redis-server restart