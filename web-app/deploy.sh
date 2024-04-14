export PATH=$HOME/.nvm/versions/node/v16.18.1/bin:$PATH
npm install
npm run build
mkdir -p ~/$(date +"%Y-%m-%d")_build/
sudo rm -rf ~/$(date +"%Y-%m-%d")_build/* || true
sudo mv /etc/nginx/build/* ~/$(date +"%Y-%m-%d")_build/
sudo cp -r build/* /etc/nginx/build/
sudo systemctl restart nginx
sudo systemctl restart main
