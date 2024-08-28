var socket = io();

var canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

document.getElementById("game").width = document.documentElement.clientWidth;
document.getElementById("game").height = document.documentElement.clientHeight;

let playerSprite = new Image();
playerSprite.src = 'https://filesfor.github.io/bean.png'; // Default sprite URL

playerSprite.onload = function() {
    socket.on('state', (gameState) => {
      ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
      for (let id in gameState.players) {
        drawPlayer(gameState.players[id]);
      }
    });
};

function drawPlayer(player) {
    const playerImage = new Image();
    playerImage.src = player.sprite;

    playerImage.onload = () => {
        ctx.drawImage(playerImage, player.x, player.y, 50, 50);

        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        ctx.strokeText(player.name, player.x + 25, player.y - 10);
        ctx.fillText(player.name, player.x + 25, player.y - 10);
    }
}
