const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

console.clear();

app.use(express.static(path.join(__dirname, '../../build')));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res, next) =>
  res.sendFile(__dirname + './index.html'));

io.on('connection', socket => {
  socket.emit('hello', { message: 'hello from server' })
}
);


var clients = [];
var messAges = [];

io.sockets.on('connection', function (socket) {

  var clientInfo = new Object();
  socket.on('storeClientInfo', function (data) {
    clientInfo.customId = data.customId;
    clientInfo.name = data.name;
    clientInfo.clientId = socket.id;
    if (clientInfo.name !== undefined) {
      clients.push(clientInfo);
      console.log('>> New client connected')
      console.log("-----------");
      console.log(clients.length + " connected");
      console.log(clients);
      console.log("-----------");
    }
    io.emit('server message', clients);
  });

  var cMessages = new Object();
  socket.on('storeChat', function (data) {
/*     console.log(`Text: ${data.text}`);
 */        cMessages.text = data.text
    cMessages.user = data.user
    messAges.push(cMessages);
/*         console.log(messAges);
 */    io.emit('chatMessage', messAges);
  }
  );




  socket.on('disconnect', function (data) {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];
      if (c.clientId === socket.id) {
        clients.splice(i, 1);
        console.log("<< Client disconnected");
        console.log("-----------");
        console.log(clients.length + " connected");
        console.log(clients);
        console.log("-----------");
        io.emit('server message', clients);
        break;
      }
    }
  });
});



console.log(`

---------------------------------
  SERVER STARTED!
  on port ${port}
---------------------------------


`);

server.listen(port);