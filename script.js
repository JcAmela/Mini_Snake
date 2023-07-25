var DOT_SIZE = 20;
var GAME_BOARD_SIZE = 500;
var GAME_BOARD_UNITS = GAME_BOARD_SIZE / DOT_SIZE;
var START_DIRECTION = { x: 1, y: 0 };
var START_SPEED = 200;
var SNAKE_CLASS_NAME = 'dot';
var FOOD_CLASS_NAME = 'food';
var INITIAL_SCORE = 0;
var GAME_INFO = {
  gameBoardElement: document.getElementById('game-board'),
  timerElement: document.getElementById('timer'),
  scoreElement: document.getElementById('score'),
  gameOverElement: document.getElementById('game-over'),
  finalScoreElement: document.getElementById('final-score'),
  restartButtonElement: document.getElementById('restart-btn'),
};

var Game = {
  snakeBody: [],
  food: null,
  direction: START_DIRECTION,
  gameSpeed: START_SPEED,
  isPaused: false,
  gameInterval: null,
  timerInterval: null,
  score: INITIAL_SCORE,
  gameStartTime: null,
};

initializeGame();

function initializeGame() {
  Game.snakeBody.push({ top: 0, left: 0, element: createGameElement(SNAKE_CLASS_NAME) });
  Game.gameStartTime = Date.now();
  Game.timerInterval = setInterval(updateTimer, 1000);
  Game.gameInterval = setInterval(gameLoop, Game.gameSpeed);

  GAME_INFO.restartButtonElement.addEventListener('click', function() {
    location.reload();
  });

  window.addEventListener('keydown', handleKeyPress);
}

function createGameElement(className) {
  var element = document.createElement('div');
  element.className = className;
  GAME_INFO.gameBoardElement.appendChild(element);
  return element;
}

function updateGameElementOnBoard(bodyPart) {
  bodyPart.element.style.left = `${bodyPart.left * DOT_SIZE}px`;
  bodyPart.element.style.top = `${bodyPart.top * DOT_SIZE}px`;
}

function createFood() {
  Game.food = {
    left: Math.floor(Math.random() * GAME_BOARD_UNITS),
    top: Math.floor(Math.random() * GAME_BOARD_UNITS),
    element: createGameElement(FOOD_CLASS_NAME)
  };
  updateGameElementOnBoard(Game.food);
}

function gameLoop() {
  var newHead = getNextHead();

  if (hasCollidedWithSelf(newHead)) {
    endGame();
  }

  Game.snakeBody.unshift(newHead);
  handleFoodConsumption();
  
  if (!Game.food) createFood();
  Game.snakeBody.forEach(updateGameElementOnBoard);
}

function getNextHead() {
  var oldHead = Game.snakeBody[0];
  return { 
    top: (GAME_BOARD_UNITS + oldHead.top + Game.direction.y) % GAME_BOARD_UNITS, 
    left: (GAME_BOARD_UNITS + oldHead.left + Game.direction.x) % GAME_BOARD_UNITS, 
    element: createGameElement(SNAKE_CLASS_NAME) 
  };
}

function hasCollidedWithSelf(head) {
  return Game.snakeBody.some(bodyPart => bodyPart.top === head.top && bodyPart.left === head.left);
}

function handleFoodConsumption() {
  if (Game.food && Game.snakeBody[0].top === Game.food.top && Game.snakeBody[0].left === Game.food.left) {
    GAME_INFO.gameBoardElement.removeChild(Game.food.element);
    Game.food = null;
    Game.score++;
    updateScore();
  } else {
    var removed = Game.snakeBody.pop();
    GAME_INFO.gameBoardElement.removeChild(removed.element);
  }
}

function updateTimer() {
  var timeElapsed = Math.floor((Date.now() - Game.gameStartTime) / 1000);
  GAME_INFO.timerElement.textContent = timeElapsed + 's';
}

function updateScore() {
  GAME_INFO.scoreElement.textContent = "Score: " + Game.score;
}

function endGame() {
  clearInterval(Game.gameInterval);
  clearInterval(Game.timerInterval);
  GAME_INFO.finalScoreElement.textContent = Game.score;
  GAME_INFO.gameOverElement.style.display = 'block';
}

function handleKeyPress(e) {
  var keyMappings = {
    'w': { x: 0, y: -1 },
    'a': { x: -1, y: 0 },
    's': { x: 0, y: 1 },
    'd': { x: 1, y: 0 },
    ' ': togglePause,
    '+': increaseGameSpeed,
    '-': decreaseGameSpeed,
  };

  var action = keyMappings[e.key.toLowerCase()];
  if (typeof action === 'function') {
    action();
  } else if (action) {
    changeDirection(action);
  }
}

function togglePause() {
  if (Game.isPaused) {
    Game.gameInterval = setInterval(gameLoop, Game.gameSpeed);
    Game.isPaused = false;
  } else {
    clearInterval(Game.gameInterval);
    Game.isPaused = true;
  }
}

function increaseGameSpeed() {
  Game.gameSpeed = Math.max(50, Game.gameSpeed - 50); 
  resetGameInterval();
}

function decreaseGameSpeed() {
  Game.gameSpeed += 50; 
  resetGameInterval();
}

function changeDirection(newDirection) {
  if (-newDirection.x !== Game.direction.x && -newDirection.y !== Game.direction.y) {
    Game.direction = newDirection;
  }
}

function resetGameInterval() {
  if (!Game.isPaused) {
    clearInterval(Game.gameInterval);
    Game.gameInterval = setInterval(gameLoop, Game.gameSpeed);
  }
}
