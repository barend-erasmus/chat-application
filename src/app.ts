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
import { MessageRepository } from './repositories/mongo/message';

const argv = yargs.argv;

const app = express();
const server = http.createServer(app);
let socketio;

app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.get('/', (req, res) => {
  const id = uuid.v4();
  res.redirect(`/chat?id=${id}`);
});

app.get('/chat', (req, res) => {
  if (socketio.nsps[`/id-${req.query.id}`] === undefined) {
    createNewNamespace(req.query.id);
  }

  res.sendFile( __dirname + '/public/index-basic.html');
});

socketio = io.listen(app.listen(argv.port || 3000));

function createNewNamespace(id: string) {

  const namespace = socketio.of(`/id-${id}`);

  namespace.on('connection', (socket) => {
    socket.on('message', (data) => {
      const messageRepository = new MessageRepository('mongodb://localhost:27017/chat-application');
      const messageService = new MessageService(messageRepository);
      messageService.create(id, data.username, data.text).then((x) => {
        namespace.emit('message', x);
      });
    });

    socket.on('history', (data) => {
      const messageRepository = new MessageRepository('mongodb://localhost:27017/chat-application');
      const messageService = new MessageService(messageRepository);
      messageService.list(id).then((x) => {
        socket.emit('history', x);
      });
    });
  });
}
