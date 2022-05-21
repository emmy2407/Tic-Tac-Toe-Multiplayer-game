
var express = require('express')
var app = express()
app.use(express.static('public'))
const port = process.env.PORT || 3800
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');         
});


var players = {},
  unmatched; 

  io.sockets.on("connection", function (socket) {
    console.log("socket connected")
  joinGame(socket);

  if (getOpponent(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].symbol,
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol,
    });
  }

  socket.on("make.move", function (data) {
    if (!getOpponent(socket)) {
      return;
    }
    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
  });

  socket.on("disconnect", function () {
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
    }
  });
});

function joinGame(socket) {
  players[socket.id] = {
    opponent: unmatched,

    symbol: "X",
    // The socket that is associated with this player
    socket: socket,
  };
  if (unmatched) {
    players[socket.id].symbol = "O"; 
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
}

function getOpponent(socket) {
  if (!players[socket.id].opponent) {
    return;
  } 
  return players[players[socket.id].opponent].socket;
};


http.listen(port, function(){
  console.log(`listening on http://localhost:${port}`); 
});
