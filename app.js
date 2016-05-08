var express = require('express'),
app = express(),
server = require('http').createServer(app),
io =  require('socket.io').listen(server),
port = process.env.PORT || 3000,
winston = require('winston');

server.listen(port, function(){
  winston.log("Server listening at port %d", port);
});

app.use(express.static("public"));

io.on('connection', function(socket){
  winston.debug("A user has connected");
  socket.on('join', function(msg){
    var room = msg.room;
    socket.join(room);
    winston.debug("A user has joined room= " + room);
  });

  socket.on('disconnect', function(){
    winston.debug("a user has disconnected");
  });

  socket.on('error', function(e){
    winston.error("An error has occurred ", e);
  });
});
