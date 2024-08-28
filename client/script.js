var socket = io();

var canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

document.getElementById("game").width = document.documentElement.clientWidth;
document.getElementById("game").height = document.documentElement.clientHeight;

let playerSprite = new Image();
const spriteSelector = document.getElementById('sprite');
const nameInput = document.getElementById('playerName');

function updateSprite() {
  playerSprite.src = spriteSelector.value;
}

playerSprite.onload = function() {
    socket.on('state', (gameState) => {
      ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
      for (let id in gameState.players) {
        drawPlayer(gameState.players[id]);
      }
    });
};

spriteSelector.addEventListener('change', updateSprite);

function joinGame() {
  let playerName = nameInput.value.trim();
  if (playerName) {
    socket.emit('newPlayer', { name: playerName, sprite: spriteSelector.value });
  } else {
    alert('Please enter a name.');
  }
}

document.getElementById('name-input').addEventListener('change', joinGame);

function drawPlayer(player) {
    if (playerSprite.complete && playerSprite.naturalHeight !== 0) {
        ctx.drawImage(playerSprite, player.x, player.y, 50, 50);

        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        ctx.strokeText(player.name, player.x + 25, player.y - 10);
        ctx.fillText(player.name, player.x + 25, player.y - 10);
    } else {
        console.error("Image not loaded or failed to load.");
    }
}
