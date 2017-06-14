// Imports
import * as express from 'express';
import * as http from 'http';
import * as io from 'socket.io';
import * as uuid from 'uuid';
import * as rp from 'request-promise';

// Imports services
import { MessageService } from './services/message';

// Imports repositories
import { MessageRepository } from './repositories/mongo/message';

// Import configurations
let config = require('./config').config;

const argv = require('yargs').argv;

if (argv.prod) {
  config = require('./config.prod').config;
}

const app = express();
const server = http.createServer(app);
let socketio;

app.get('/', (req, res) => {
  const id = uuid.v4();

  const options = {
    method: 'POST',
    uri: 'https://hooks.slack.com/services/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',
    body: {
      text: `New Chat has started. Please <http://localhost:3000/chat?id=${id}|Click here>.`
    },
    json: true
  };

  rp(options)
    .then((parsedBody: any) => {

    })
    .catch((err: Error) => {

    });

  res.redirect(`/chat?id=${id}`);
});

app.get('/chat', (req, res) => {
  if (socketio.nsps[`/id-${req.query.id}`] === undefined) {
    createNewNamespace(req.query.id);
  }

  res.sendFile(__dirname + '/public/index.html');
});

socketio = io.listen(app.listen(3000));

function createNewNamespace(id: string) {

  const namespace = socketio.of(`/id-${id}`);

  namespace.on('connection', (socket) => {
    socket.on('message', (data) => {
      const messageRepository = new MessageRepository(config.db.uri);
      const messageService = new MessageService(messageRepository);
      messageService.create(id, data.username, data.text).then((x) => {
        namespace.emit('message', x);
      });
    });

    socket.on('history', (data) => {
      const messageRepository = new MessageRepository(config.db.uri);
      const messageService = new MessageService(messageRepository);
      messageService.list(id).then((x) => {
        socket.emit('history', x);
      });
    });
  });
}
