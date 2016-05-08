var express = require('express'),
app = express(),
server = require('http').createServer(app),
io =  require('socket.io').listen(server),
port = process.env.PORT || 3000,
winston = require('winston'),
redis = require("redis"),
client = redis.createClient();

server.listen(port, function(){
  winston.log("Server listening at port %d", port);
});

app.use(express.static("public"));

app.get("/rooms/new", function(req, res){
  var roomId = client.incr("roomSeq");
  res.redirect("/poll.html?"+roomId);
});

function upvote(roomId, questionId){
  client.incr(redisKeys.getQuestionVotes(roomId, questionId));
}

function downvote(roomId, questionId){
  client.decr(redis.getQuestionVotes(roomId, questionId));
}

function createNewQuestion(roomId, question){
  var questionId = client.incr(getQuestionSeq(roomId));
  client.hset(redisKeys.getRoom(roomId), questionId, question);
  upvote(roomId, questionId);
}

function getCurrentState(roomId){
  var state = {};
  var questions = client.hgetall(redisKeys.getRoom(roomId));
  for(var questionId in questions){
    var votes = client.get(redisKeys.getQuestionVotes(roomId, questionId));
    state[questionId] = {"question" : questions[questionId], "id": questionId}
  }
  return state;
}

io.on('connection', function(socket){

  socket.on('join', function(msg){
    var room = msg.room;
    socket.join(room);
    winston.debug("A user has joined room= " + room);
    io.to(msg.roomId).emit("update",getCurrentState());
  });

  socket.on("upvote", function(msg){
    upvote(msg.roomId, msg.questionId);
    io.to(msg.roomId).emit("update",getCurrentState());
  });

  socket.on("downvote", function(msg){
    downvote(msg.roomId, msg.questionId);
    io.to(msg.roomId).emit("update",getCurrentState());
  });

  socket.on('newQuestion', function(msg){
    createNewQuestion(msg.roomId, msg.question);
    io.to(msg.roomId).emit("update",getCurrentState());
  });

  socket.on('disconnect', function(){
    winston.debug("a user has disconnected");
  });

  socket.on('error', function(e){
    winston.error("An error has occurred ", e);
  });
});

var redisKeys = {
  getQuestionVotes: function(roomId, questionId){
    return "r."+roomId+".q."+questionId+".v";
  },
  getRoomSeq: function(){
    return "r.seq";
  },
  getQuestionSeq: function(roomId){
    return "r."+roomId+".seq";
  },
  getRoom: function(roomId){
    return "r."+roomId;
  }
}
