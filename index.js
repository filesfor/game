var express = require('express');
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var app = express();
var htmlPath = path.join(__dirname, 'client');
app.use(express.static(htmlPath));

const gameState = {
  players: {}
};

io.on('connection', (socket) => {
  socket.on('newPlayer', (playerData) => {
    const { name, sprite } = playerData;
    console.log(`Player named ${name} with sprite ${sprite} joined!`);
    gameState.players[socket.id] = {
      x: 250,
      y: 250,
      name: name || 'Anonymous',
      sprite: sprite || 'https://filesfor.github.io/bean.png'
    };
  });

  socket.on('playerMovement', (playerMovement) => {
    const player = gameState.players[socket.id];
    const canvasWidth = 1200;
    const canvasHeight = 700;

    if (playerMovement.left && player.x > 0) {
      player.x -= 4;
    }
    if (playerMovement.right && player.x < canvasWidth) {
      player.x += 4;
    }
    if (playerMovement.up && player.y > 0) {
      player.y -= 4;
    }
    if (playerMovement.down && player.y < canvasHeight) {
      player.y += 4;
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player with ID ${socket.id} disconnected.`);
    delete gameState.players[socket.id];
  });
});

setInterval(() => {
  io.sockets.emit('state', gameState);
}, 1000 / 60);

http.listen(3000, () => {
  console.log('listening on *:3000');
});
