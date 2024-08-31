var app = require("express")();
var express = require("express");
var path = require("path");
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var badWords = require("./words.json");

var htmlPath = path.join(__dirname, "client");
app.use(express.static(htmlPath));

const gameState = {
  players: {},
};

const validateName = (name) => {
  if (!name || name.trim() === "") return false;

  const namePattern = /^[a-zA-Z0-9!@\$%\*]{1,20}$/;
  if (!namePattern.test(name)) return false;

  const lowerCaseName = name.toLowerCase();
  return !badWords.some((badWord) => lowerCaseName.includes(badWord));
};

io.on("connection", (socket) => {
  socket.on("newPlayer", (playerName) => {
    if (validateName(playerName)) {
      gameState.players[socket.id] = {
        x: 250,
        y: 250,
        name: playerName,
      };
    } else {
      console.log(`Invalid name received: ${playerName}`);
      socket.emit(
        "invalidName",
        "Please pick a better name such as Pretty Princess 123."
      );
    }
  });

  socket.on("playerMovement", (playerMovement) => {
    const player = gameState.players[socket.id];
    const canvasWidth = 700;
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

  socket.on("disconnect", () => {
    delete gameState.players[socket.id];
  });
});

setInterval(() => {
  io.sockets.emit("state", gameState);
}, 1000 / 60);

http.listen(3000, () => {
  console.log("listening on *:3000");
});
