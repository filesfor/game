// Get the canvas
var canvas = document.getElementById("game");

// Object that stores the current pressed keys and touch movement
const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};

// Object that stores the current touch positions
const touchMovement = {
  startX: null,
  startY: null,
  deltaX: 0,
  deltaY: 0
};

// Function that runs whenever a key is pressed, and updates the object
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

// Function that runs when a key is released, and updates the object
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

// Function to handle touch move events
const touchMoveHandler = (e) => {
  console.log("Touch Move");
  if (touchMovement.startX === null || touchMovement.startY === null) return;

  const touch = e.touches[0];
  touchMovement.deltaX = touch.clientX - touchMovement.startX;
  touchMovement.deltaY = touch.clientY - touchMovement.startY;

  // Determine direction based on touch movement
  if (Math.abs(touchMovement.deltaX) > Math.abs(touchMovement.deltaY)) {
    playerMovement.right = touchMovement.deltaX > 0;
    playerMovement.left = touchMovement.deltaX < 0;
  } else {
    playerMovement.down = touchMovement.deltaY > 0;
    playerMovement.up = touchMovement.deltaY < 0;
  }
};

// Function to handle touch end events
const touchEndHandler = () => {
  console.log("Touch End");
  // Reset touch movement
  touchMovement.startX = null;
  touchMovement.startY = null;
  touchMovement.deltaX = 0;
  touchMovement.deltaY = 0;

  // Stop movement
  playerMovement.right = false;
  playerMovement.left = false;
  playerMovement.up = false;
  playerMovement.down = false;
};

// Attach touch event listeners
document.getElementById('touchpad').addEventListener('touchstart', touchStartHandler);
document.getElementById('touchpad').addEventListener('touchmove', touchMoveHandler);
document.getElementById('touchpad').addEventListener('touchend', touchEndHandler);

// Make the functions run whenever the events happen
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Send the movement to the server 60 times / second
setInterval(() => {
  console.log(playerMovement);
  socket.emit('playerMovement', playerMovement);
}, 1000 / 60);
