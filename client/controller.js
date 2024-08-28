var socket = io(); // Ensure this line is present and correctly placed

var canvas = document.getElementById("game");

const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};

const touchMovement = {
  startX: null,
  startY: null,
  deltaX: 0,
  deltaY: 0
};

const keyDownHandler = (e) => {
  if (e.keyCode == 39 || e.keyCode == 68) {
    playerMovement.right = true;
  } else if (e.keyCode == 37 || e.keyCode == 65) {
    playerMovement.left = true;
  } else if (e.keyCode == 38 || e.keyCode == 87) {
    playerMovement.up = true;
  } else if (e.keyCode == 40 || e.keyCode == 83) {
    playerMovement.down = true;
  }
};

const keyUpHandler = (e) => {
  if (e.keyCode == 39 || e.keyCode == 68) {
    playerMovement.right = false;
  } else if (e.keyCode == 37 || e.keyCode == 65) {
    playerMovement.left = false;
  } else if (e.keyCode == 38 || e.keyCode == 87) {
    playerMovement.up = false;
  } else if (e.keyCode == 40 || e.keyCode == 83) {
    playerMovement.down = false;
  }
};

// Function to handle touch start events
const touchStartHandler = (e) => {
  console.log("Touch Start");
  const touch = e.touches[0];
  touchMovement.startX = touch.clientX;
  touchMovement.startY = touch.clientY;
};

const touchMoveHandler = (e) => {
  console.log("Touch Move");
  if (touchMovement.startX === null || touchMovement.startY === null) return;

  const touch = e.touches[0];
  touchMovement.deltaX = touch.clientX - touchMovement.startX;
  touchMovement.deltaY = touch.clientY - touchMovement.startY;

  if (Math.abs(touchMovement.deltaX) > Math.abs(touchMovement.deltaY)) {
    playerMovement.right = touchMovement.deltaX > 0;
    playerMovement.left = touchMovement.deltaX < 0;
  } else {
    playerMovement.down = touchMovement.deltaY > 0;
    playerMovement.up = touchMovement.deltaY < 0;
  }
};

const touchEndHandler = () => {
  console.log("Touch End");
  touchMovement.startX = null;
  touchMovement.startY = null;
  touchMovement.deltaX = 0;
  touchMovement.deltaY = 0;

  playerMovement.right = false;
  playerMovement.left = false;
  playerMovement.up = false;
  playerMovement.down = false;
};

document.getElementById('touchpad').addEventListener('touchstart', touchStartHandler);
document.getElementById('touchpad').addEventListener('touchmove', touchMoveHandler);
document.getElementById('touchpad').addEventListener('touchend', touchEndHandler);

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

setInterval(() => {
  console.log(playerMovement);
  socket.emit('playerMovement', playerMovement);
}, 1000 / 60);
