var React = require('react');
var ReactDOM = require('react-dom');
require('bootstrap');
var socket = io();

function getRoom(){
    var url = window.location.href;
    var split = url.split("\?");
    return split[split.length-1];
}

socket.on('connect', function(){
  console.log("socket.io connected, joining room...");
  var room = getRoom();
  socket.emit('join', {room: room});
  console.log("joined: " + room)
});

socket.on('disconnect', function(){
  console.log("disconnected");
});
