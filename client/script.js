var socket = io();

var canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

document.getElementById("game").width = document.documentElement.clientWidth;
document.getElementById("game").height = document.documentElement.clientHeight;

let playerName;
do {
    playerName = prompt("Enter your name:");
} while (!isValidName(playerName));

socket.emit('newPlayer', playerName);

const playerSprite = new Image();
playerSprite.src = 'https://filesfor.github.io/sprite1.png';

playerSprite.onload = function() {
    socket.on('state', (gameState) => {
        ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
        for (let id in gameState.players) {
            drawPlayer(gameState.players[id]);
        }
    });
};

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

function isValidName(name) {
    const namePattern = /^[a-zA-Z0-9!@\$%\*]{1,20}$/;
    return namePattern.test(name);
}

socket.on('invalidName', (message) => {
    alert(message);
    let newName;
    do {
        newName = prompt("Enter a different name:");
    } while (!isValidName(newName));
    socket.emit('newPlayer', newName);
});
