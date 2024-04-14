# CourseSearch CIS3760

## Website's URL
- https://group101.crabdance.com
- https://20.220.184.79/
- Currently we have a self-signed certificate but it gives the user a warning when they first join the website. You should just bypass this by continuing to website

## The technology stack:
- Frontend: React with bootstrap
- Backend: Flask, Gunicorn, NGINX, Ubuntu 18.04
- These programs were designed to run on Python 3.7.15

## Start server(Run both commands one after the other):
- sudo systemctl start main
- sudo systemctl start nginx

## Restart server(Run both commands one after the other):
- sudo systemctl restart main
- sudo systemctl restart nginx

## Config files/Run the install script
- ./install.sh
- The script should install and set up everything necessary. There needs to be read and write access avaiable in the directory.
- The script copies the config files and places them into the appropriate directories. You do not need to worry about this
- If there is an error running this script then run: sudo chmod 777 install.sh
- DO NOT run the script on the VM, it will destroy it
- NOTE: do not to run the install.sh script if doing local development

## Setting up Flask:
- Open the root directory in your terminal
- enter "python3 -m venv venv"
- enter ". venv/bin/activate"
- enter "pip install Flask"
- Make sure everything is up to date
- Enter "flask --app main  --debug  run" the debug flag is optional

## Setting up React
- ReadMe in Web-app contains instructions to set up and run react app

## Copy the files from the server from to your computer on linux
- scp -r -i group101_key.pem group101@20.168.113.198:~/coursesearch-cis3760/ ~/courses

## Redis
- In order to start local development, you will need to install a redis server. 
- Run the following commands:
- curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
- echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
- sudo apt update
- sudo apt install redis 

- Then run: redis-server
- Then put the server in the background by using: Ctrl + Z
- Then install the python package. With the most recent git version, run pip3 install -r config_files/requirements.txt
- Finally, run the redis-connection.py file to populate your database with the data
