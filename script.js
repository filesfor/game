// Initialize socket.io
var socket = io();

// Initialize canvas
var canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Set canvas size
document.getElementById("game").width = document.documentElement.clientWidth;
document.getElementById("game").height = document.documentElement.clientHeight;

// Prompt the player for a name and join the game
let playerName = prompt("Enter your name:");
socket.emit('newPlayer', playerName);

// Load the player sprite
const playerSprite = new Image();
playerSprite.src = 'https://filesfor.github.io/bean.png'; // Replace with the path to your PNG file

// Set an onload event to ensure the image is fully loaded
playerSprite.onload = function() {
    // The image is now loaded, and you can safely use it in drawImage
    // Listen to the server and draw the players
    socket.on('state', (gameState) => {
      // Clear the canvas
      ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
      // Draw the players that the server sent
      for (let id in gameState.players) {
        drawPlayer(gameState.players[id]);
      }
    });
};

// Draw a player sprite and name at x, y
function drawPlayer(player) {
    if (playerSprite.complete && playerSprite.naturalHeight !== 0) {
        // Draw the player sprite
        ctx.drawImage(playerSprite, player.x, player.y, 50, 50);

        // Set font and text alignment for the player name
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        // Draw the player's name with a shadow for visibility
        ctx.strokeText(player.name, player.x + 25, player.y - 10);
        ctx.fillText(player.name, player.x + 25, player.y - 10);
    } else {
        console.error("Image not loaded or failed to load.");
    }
}
