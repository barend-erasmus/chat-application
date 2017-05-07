# -- BUILD AND INSTALL 'chat-application' --

# Declare varibles
domain=$1

# Update machine package indexes
sudo apt-get update

# Download and run script to install node 7
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

# Install node 7
apt-get install -y nodejs

# Install 'typescript' node package
npm install -g typescript

# Install 'gulp' node package
npm install -g gulp

# -- BUILD 'chat-application-db' project --

docker run --name chat-application-db -v /opt/mongodb:/data/db -d mongo

# -- BUILD 'chat-application' project --

# Clone 'chat-application' repository
git clone https://github.com/barend-erasmus/chat-application.git

# Change to cloned directory
cd ./chat-application

# Replace domain
sed -i -- "s/yourdomain.com/$domain/g" ./src/config.prod.ts

# Install node packages
npm install

# Build project
npm run build

# Build docker image
docker build --no-cache -t chat-application ./

# Stop docker container
docker stop chat-application

# Run docker as deamon
docker run -d -p 80:3000 --name chat-application --link chat-application-db:mongo -t chat-application
