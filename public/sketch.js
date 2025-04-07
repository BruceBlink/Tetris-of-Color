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
let higestScore = 0; // Highest score variable
let gameOver = false; // Game over flag
let handleLeftX = 0; // Handle left position
let handleLeftY = 0; // Handle left position

let leftButtonX = 0; // Left button position
let leftButtonY = 0; // Left button position
let downButtonX = 0; // Down button position
let downButtonY = 0; // Down button position
let rightButtonX = 0; // Right button position
let rightButtonY = 0; // Right button position
let upButtonX = 0; // Up button position
let upButtonY = 0; // Up button position

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

  // 绘制游戏边框
  drawBorder();

  // If the game is over, display a message and stop game logic
  if (gameOver) {
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over", (cols * resolution) / 2, height / 2); // 修改 x 坐标为游戏区域中央
    textSize(24);
    text("Press R to Restart", (cols * resolution) / 2, height / 2 + 50); // 同样调整 x 坐标
    higestScore = max(higestScore, score); // Update highest score if needed
    //score = 0; // Reset score
    displayScore(); // Display the score
    displayHighestScore(cols * resolution - 10, 10); // Adjusted position for highest score
    displayHandle();
    return; // Stop further drawing
  }

  // Draw the grid and the current falling piece
  drawGrid();
  currentPiece.show();

  // Draw the "Next Piece" box
  drawNextPiece();

  // Manage automatic drop based on timer
  if (millis() - lastDropTime > dropInterval) {
    // Check if it's time to drop the piece
    // Move the piece down
    currentPiece.update();

    lastDropTime = millis();
  }

  // Display the score
  displayScore();
  // Display the highest score
  displayHighestScore(cols * resolution - 10, 10); // Adjusted position for highest score
  displayHandle(); // Draw the handle
}

// 绘制游戏边框
function drawBorder() {
  stroke(255); // 边框颜色为白色
  strokeWeight(4); // 边框线条宽度
  noFill(); // 边框内部不填充
  rect(0, 0, cols * resolution, rows * resolution); // 绘制边框
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
  fill(0, 0, 255);
  textSize(24);
  textAlign(LEFT, TOP); // Ensure score is displayed at the top-left corner
  text(`Score: ${score}`, 10, 10); // Fixed position for the score
}
// display the highest score
function displayHighestScore(x, y) {
  fill(0, 0, 255);
  textSize(24);
  textAlign(RIGHT, TOP); // Ensure score is displayed at the top-left corner
  text(`Highest Score: ${higestScore}`, x, y); // Fixed position for the score
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
  /*   fill(255);
  textSize(16);
  textAlign(CENTER, TOP);
  text("Next Piece", boxX + boxWidth / 2, boxY - 20); */
}

function displayHandle() {
  handleLeftX = cols * resolution + 10; // Update the handle's X position
  handleLeftY = rows * resolution - 4 * resolution; // Update the handle's Y position
  fill(0);
  stroke(255);
  strokeWeight(4);
  rect(handleLeftX, handleLeftY, 4 * resolution, 4 * resolution); // Draw a rectangle as a handle
  leftButtonX = handleLeftX; // Update the button's X position
  leftButtonY = handleLeftY + 1.5 * resolution; // Update the button's Y position
  downButtonX = handleLeftX + 1.5 * resolution; // Update the button's X position
  downButtonY = handleLeftY + 3 * resolution; // Update the button's Y position
  rightButtonX = handleLeftX + 3 * resolution; // Update the button's X position
  rightButtonY = handleLeftY + 1.5 * resolution; // Update the button's Y position
  upButtonX = handleLeftX + 1.5 * resolution; // Update the button's X position
  upButtonY = handleLeftY; // Update the button's Y position
  fill(0, 255, 255);
  stroke(255);
  strokeWeight(4);
  rect(leftButtonX, leftButtonY, resolution, resolution); // Draw a left button
  rect(downButtonX, downButtonY, resolution, resolution); // Draw a down button
  rect(rightButtonX, rightButtonY, resolution, resolution); // Draw a down button
  rect(upButtonX, upButtonY, resolution, resolution); // Draw a down button
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
    stroke(255);
    strokeWeight(4);
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
            //
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

// Handle mouse input for controlling the piece
function mouseClicked() {
  // Check if the mouse is within the handle area
  if (
    mouseX >= handleLeftX &&
    mouseX <= handleLeftX + 4 * resolution &&
    mouseY >= handleLeftY &&
    mouseY <= handleLeftY + 4 * resolution
  ) {
    // Check which button was clicked
    if (
      mouseX >= leftButtonX &&
      mouseX <= leftButtonX + resolution &&
      mouseY >= leftButtonY &&
      mouseY <= leftButtonY + resolution
    ) {
      currentPiece.x -= 1; // Move left
      if (currentPiece.collides()) currentPiece.x += 1;
    } else if (
      mouseX >= downButtonX &&
      mouseX <= downButtonX + resolution &&
      mouseY >= downButtonY &&
      mouseY <= downButtonY + resolution
    ) {
      currentPiece.update(); // Move down
    } else if (
      mouseX >= rightButtonX &&
      mouseX <= rightButtonX + resolution &&
      mouseY >= rightButtonY &&
      mouseY <= rightButtonY + resolution
    ) {
      currentPiece.x += 1; // Move right
      if (currentPiece.collides()) currentPiece.x -= 1;
    } else if (
      mouseX >= upButtonX &&
      mouseX <= upButtonX + resolution &&
      mouseY >= upButtonY &&
      mouseY <= upButtonY + resolution
    ) {
      currentPiece.rotate(); // Rotate piece
      if (currentPiece.collides()) currentPiece.rotate(); // Rotate back if collides
    }
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
