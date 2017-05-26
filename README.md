# chat-application

![](http://jenkins.developersworkspace.co.za:8080/job/chat-application-nightly/badge/icon)

## Getting Started

Clone the repository

`https://github.com/barend-erasmus/chat-application.git`

Change to cloned directory

`cd ./chat-application`

Install node packages

`npm install`

Start project

`npm start`

Browse `http://localhost:3000`

## Docker Setup

`docker run --name chat-application-db -v /opt/chat-application/mongodb:/data/db -d mongo`

``docker build --no-cache -t chat-application ./``

`docker run -d -p 8080:3000 --name chat-application --link chat-application-db:mongo -t chat-application`

