// ==========================================
// MY DINO GAME
// config.js
// Version 1.0
// ==========================================


// ------------------------------------------
// CANVAS SETUP
// ------------------------------------------

const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");

const scoreElement =
    document.getElementById("score");

const gameOverElement =
    document.getElementById("game-over");

const restartButton =
    document.getElementById("restart-button");


// ------------------------------------------
// GAME SETTINGS
// ------------------------------------------

const GAME_WIDTH = canvas.width;

const GAME_HEIGHT = canvas.height;

const GROUND_Y = 250;


// ------------------------------------------
// GAME STATE
// ------------------------------------------

let gameRunning = true;

let score = 0;

let highScore = 0;

let gameSpeed = 6;

let frameCount = 0;


// ------------------------------------------
// GROUND
// ------------------------------------------

let groundOffset = 0;


// ------------------------------------------
// OBSTACLES
// ------------------------------------------

let obstacles = [];

let obstacleTimer = 0;

let nextObstacleTime = 100;
