// Variables for game grid and pieces
let grid;
let cols = 10;
let rows = 20;
let resolution;
let currentPiece;
let nextPiece; // 新增：存储下一个方块
let dropInterval = 500; // Time interval for automatic drop (milliseconds)
let lastDropTime = 0;
let score = 0; // Score variable
let gameOver = false; // Game over flag

function setup() {
  // Make the game responsive to the screen size
  resolution = min(windowWidth / (cols + 5), windowHeight / rows); // 为右侧提示框预留空间
  let canvas = createCanvas((cols + 5) * resolution, rows * resolution);

  // 将画布附加到 #game-container
  canvas.parent("game-container");

  // Initialize the grid and create the first piece
  grid = create2DArray(cols, rows);
  currentPiece = new Piece();
  nextPiece = new Piece(); // 新增：生成下一个方块
}

function draw() {
  background(0); // Clear the canvas

  // If the game is over, display a message and stop game logic
  if (gameOver) {
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    textSize(24);
    text("Press R to Restart", width / 2, height / 2 + 50);
    return; // Stop further drawing
  }

  // Draw the grid and the current falling piece
  drawGrid();
  currentPiece.show();

  // Draw the "Next Piece" box
  drawNextPiece();

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
  textAlign(LEFT, TOP); // Ensure score is displayed at the top-left corner
  text(`Score: ${score}`, 10, 10); // Fixed position for the score
}

// Draw the "Next Piece" box
function drawNextPiece() {
  let boxX = cols * resolution + 10; // 提示框的 X 坐标
  let boxY = 10; // 提示框的 Y 坐标
  let boxWidth = 4 * resolution; // 提示框宽度
  let boxHeight = 4 * resolution; // 提示框高度

  // 绘制提示框背景
  fill(50);
  stroke(255);
  rect(boxX, boxY, boxWidth, boxHeight);

  // 绘制下一个方块
  if (nextPiece) {
    let scaleFactor = 0.7; // 缩放比例，确保方块适应提示框

    // 计算方块的实际宽度和高度
    let pieceWidth = nextPiece.shape[0].length * resolution * scaleFactor;
    let pieceHeight = nextPiece.shape.length * resolution * scaleFactor;

    // 计算偏移量，使方块居中
    let offsetX = boxX + (boxWidth - pieceWidth) / 2;
    let offsetY = boxY + (boxHeight - pieceHeight) / 2;

    fill(nextPiece.color);
    for (let row = 0; row < nextPiece.shape.length; row++) {
      for (let col = 0; col < nextPiece.shape[row].length; col++) {
        if (nextPiece.shape[row][col] === 1) {
          rect(
            offsetX + col * resolution * scaleFactor,
            offsetY + row * resolution * scaleFactor,
            resolution * scaleFactor,
            resolution * scaleFactor
          );
        }
      }
    }
  }

  // 显示提示文字
  fill(255);
  textSize(16);
  textAlign(CENTER, TOP);
  text("Next Piece", boxX + boxWidth / 2, boxY - 20);
}

// Piece class to handle falling blocks
class Piece {
  constructor() {
    // Define the shapes and assign colors to each
    this.shapes = [
      { shape: [[1, 1, 1, 1]], color: color(0, 255, 255) }, // I shape
      {
        shape: [
          [1, 1],
          [1, 1],
        ],
        color: color(255, 255, 0),
      }, // O shape
      {
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        color: color(128, 0, 128),
      }, // T shape
      {
        shape: [
          [1, 0, 0],
          [1, 1, 1],
        ],
        color: color(255, 165, 0),
      }, // L shape
      {
        shape: [
          [0, 0, 1],
          [1, 1, 1],
        ],
        color: color(0, 0, 255),
      }, // J shape
      {
        shape: [
          [1, 1, 0],
          [0, 1, 1],
        ],
        color: color(0, 255, 0),
      }, // S shape
      {
        shape: [
          [0, 1, 1],
          [1, 1, 0],
        ],
        color: color(255, 0, 0),
      }, // Z shape
    ];

    // Randomly select a shape
    let piece = random(this.shapes);
    this.shape = piece.shape;
    this.color = piece.color;
    this.x = 3;
    this.y = 0;

    // Check for immediate collision (game over)
    if (this.collides()) {
      gameOver = true; // Set game over flag
    }
  }

  // Display the current piece
  show() {
    fill(this.color);
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col] === 1) {
          rect(
            (this.x + col) * resolution,
            (this.y + row) * resolution,
            resolution,
            resolution
          );
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

      // 将下一个方块变为当前方块，并生成新的下一个方块
      currentPiece = nextPiece;
      nextPiece = new Piece();
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
          if (
            newX < 0 ||
            newX >= cols ||
            newY >= rows ||
            grid[newX][newY] !== 0
          ) {
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
  if (gameOver && key.toUpperCase() === "R") {
    restartGame(); // Press R to restart the game
    return;
  }

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

// Restart the game
function restartGame() {
  grid = create2DArray(cols, rows); // Reset the grid
  currentPiece = new Piece(); // Create a new piece
  nextPiece = new Piece(); // 新增：重置下一个方块
  score = 0; // Reset the score
  gameOver = false; // Reset the game over flag
  lastDropTime = millis(); // Reset the drop timer
}

// Adjust canvas size when the window is resized
function windowResized() {
  resolution = min(windowWidth / (cols + 5), windowHeight / rows); // 为右侧提示框预留空间
  resizeCanvas((cols + 5) * resolution, rows * resolution);
}
