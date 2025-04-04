// Variables for game grid and pieces
let grid;
let cols = 10;
let rows = 20;
let resolution;
let currentPiece;
let dropInterval = 500; // Time interval for automatic drop (milliseconds)
let lastDropTime = 0;
let score = 0; // Score variable

function setup() {
  // Make the game responsive to the screen size
  resolution = min(windowWidth / cols, windowHeight / rows);
  createCanvas(cols * resolution, rows * resolution);
  
  // Initialize the grid and create the first piece
  grid = create2DArray(cols, rows);
  currentPiece = new Piece();
}

function draw() {
  background(0);
  
  // Draw the grid and the current falling piece
  drawGrid();
  currentPiece.show();

  // Manage automatic drop based on timer
  if (millis() - lastDropTime > dropInterval) {
    currentPiece.update();
    lastDropTime = millis();
  }
  
  // Display the score
  displayScore();
}

// Create a 2D array to store blocks on the grid
function create2DArray(cols, rows) {
  let arr = [];
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

// Draw the grid and filled blocks
function drawGrid() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (grid[x][y] !== 0) {
        fill(grid[x][y]);
        stroke(0);
        rect(x * resolution, y * resolution, resolution, resolution);
      }
    }
  }
}

// Display the current score
function displayScore() {
  fill(255);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
}

// Piece class to handle falling blocks
class Piece {
  constructor() {
    // Define the shapes and assign colors to each
    this.shapes = [
      { shape: [[1, 1, 1, 1]], color: color(0, 255, 255) }, // I shape
      { shape: [[1, 1], [1, 1]], color: color(255, 255, 0) }, // O shape
      { shape: [[0, 1, 0], [1, 1, 1]], color: color(128, 0, 128) }, // T shape
      { shape: [[1, 0, 0], [1, 1, 1]], color: color(255, 165, 0) }, // L shape
      { shape: [[0, 0, 1], [1, 1, 1]], color: color(0, 0, 255) }, // J shape
      { shape: [[1, 1, 0], [0, 1, 1]], color: color(0, 255, 0) }, // S shape
      { shape: [[0, 1, 1], [1, 1, 0]], color: color(255, 0, 0) } // Z shape
    ];

    // Randomly select a shape
    let piece = random(this.shapes);
    this.shape = piece.shape;
    this.color = piece.color;
    this.x = 3;
    this.y = 0;
  }

  // Display the current piece
  show() {
    fill(this.color);
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col] === 1) {
          rect((this.x + col) * resolution, (this.y + row) * resolution, resolution, resolution);
        }
      }
    }
  }

  // Update the position of the piece to move down
  update() {
    this.y += 1;
    if (this.collides()) {
      this.y -= 1;
      this.mergeToGrid();
      clearFullRows();
      currentPiece = new Piece(); // Generate a new piece
    }
  }

  // Rotate the piece clockwise
  rotate() {
    let newShape = [];
    for (let y = 0; y < this.shape[0].length; y++) {
      let newRow = [];
      for (let x = this.shape.length - 1; x >= 0; x--) {
        newRow.push(this.shape[x][y]);
      }
      newShape.push(newRow);
    }
    this.shape = newShape;
  }

  // Check if the piece collides with the grid or edges
  collides() {
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col] === 1) {
          let newX = this.x + col;
          let newY = this.y + row;
          if (newX < 0 || newX >= cols || newY >= rows || grid[newX][newY] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Merge the current piece into the grid
  mergeToGrid() {
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col] === 1) {
          grid[this.x + col][this.y + row] = this.color;
        }
      }
    }
  }
}

// Clear full rows and update the score
function clearFullRows() {
  for (let y = rows - 1; y >= 0; y--) {
    let isFull = true;
    for (let x = 0; x < cols; x++) {
      if (grid[x][y] === 0) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      // Clear the full row
      for (let row = y; row > 0; row--) {
        for (let x = 0; x < cols; x++) {
          grid[x][row] = grid[x][row - 1];
        }
      }
      for (let x = 0; x < cols; x++) {
        grid[x][0] = 0;
      }
      // Increment the score
      score += 100;
      y++; // Check the same row again since it shifted down
    }
  }
}

// Handle keyboard input for controlling the piece
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    currentPiece.x -= 1;
    if (currentPiece.collides()) currentPiece.x += 1;
  } else if (keyCode === RIGHT_ARROW) {
    currentPiece.x += 1;
    if (currentPiece.collides()) currentPiece.x -= 1;
  } else if (keyCode === DOWN_ARROW) {
    currentPiece.update();
  } else if (keyCode === UP_ARROW) {
    currentPiece.rotate();
    if (currentPiece.collides()) currentPiece.rotate(); // Rotate back if collides
  }
}

// Adjust canvas size when the window is resized
function windowResized() {
  resolution = min(windowWidth / cols, windowHeight / rows);
  resizeCanvas(cols * resolution, rows * resolution);
}
