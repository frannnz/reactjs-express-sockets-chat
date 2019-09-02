const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;


app.use(express.static(path.join(__dirname, '../../build')));

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/', (req, res, next) =>
  res.sendFile(__dirname + './index.html'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});








io.on('connection', socket => {
  socket.emit('hello', { message: 'hello from server' })
}
);


var clients = [];

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


    ////

    socket.on('storeChat', function (data) {
      console.log(data.name);

      console.log('>> Chat')

    }
    );

  });


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


console.clear();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post} ${req.body.post2}`,
  );
});




console.log(`

---------------------------------
  SERVER STARTED!
  on port ${port}
---------------------------------


`);

server.listen(port);