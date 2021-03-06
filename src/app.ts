// Imports
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as io from 'socket.io';
import * as uuid from 'uuid';
import * as yargs from 'yargs';

// Imports services
import { MessageService } from './services/message';

// Imports repositories
// import { MessageRepository } from './repositories/mongo/message';
import { MessageRepository } from './repositories/sequelize/message';

const argv = yargs.argv;

const app = express();
const server = http.createServer(app);
let socketio;

app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const id = uuid.v4();
  res.redirect(`/chat?id=${id}${req.query.username? `&username=${req.query.username}` : ''}`);
});

app.get('/chat', (req, res) => {
  if (socketio.nsps[`/id-${req.query.id}`] === undefined) {
    createNewNamespace(req.query.id);
  }

  res.sendFile(__dirname + '/public/index-basic.html');
});

app.get('/feed', (req, res) => {
  if (socketio.nsps[`/username-bot`] === undefined) {
    createUsernameBotNamespace();
  }

  res.sendFile(__dirname + '/public/feed.html');
});

socketio = io.listen(app.listen(argv.port || 3000));

function createNewNamespace(id: string) {

  const namespace = socketio.of(`/id-${id}`);

  namespace.on('connection', (socket) => {
    socket.on('message', (data) => {
      // const messageRepository = new MessageRepository('mongodb://localhost:27017/chat-application');
      const messageRepository = new MessageRepository('developersworkspace.co.za', 'chat-application', 'eiZEocoCqNYduncWnVyS');
      const messageService = new MessageService(messageRepository);
      messageService.create(id, data.username, data.text).then((x) => {
        namespace.emit('message', x);

        if (data.username === 'Bot') {
          socketio.of(`/username-bot`).emit('message', x);
        }

      });
    });

    socket.on('history', (data) => {
      // const messageRepository = new MessageRepository('mongodb://localhost:27017/chat-application');
      const messageRepository = new MessageRepository('developersworkspace.co.za', 'chat-application', 'eiZEocoCqNYduncWnVyS');
      const messageService = new MessageService(messageRepository);
      messageService.list(id).then((x) => {
        socket.emit('history', x);
      });
    });
  });
}

function createUsernameBotNamespace() {
  const namespace = socketio.of(`/username-bot`);

  namespace.on('connection', (socket) => {
    socket.on('history', (data) => {
      // const messageRepository = new MessageRepository('mongodb://localhost:27017/chat-application');
      const messageRepository = new MessageRepository('developersworkspace.co.za', 'chat-application', 'eiZEocoCqNYduncWnVyS');
      const messageService = new MessageService(messageRepository);
      messageService.listByUsername('Bot').then((x) => {
        socket.emit('history', x);
      });
    });
  });
}
