var socket = require('socket.io-client');

function getRoom(){
    var url = window.location.href;
    var split = str.split("\/");
    return split[split.length-1];
}

socket.on('connect', function(){
  socket.join(getRoom());
});
