const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', (req, res, next) =>
res.sendFile(__dirname + './index.html'));

io.on('connection', socket => 
{
    console.log("USER LOG");
socket.emit ('hello', {message: 'hello from server'})

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

    }

    console.log('>> New client connected')
    console.log("-----------");
    console.log(clients.length + " connected");
    console.log(clients);
    console.log("-----------");
    io.emit('server message', clients);
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





server.listen(port);