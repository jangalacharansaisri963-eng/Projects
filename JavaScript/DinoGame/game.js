// ==========================================
// MY DINO GAME
// game.js
// Version 1.0
// ==========================================


// ------------------------------------------
// CANVAS SETUP
// ------------------------------------------

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");


// ------------------------------------------
// GAME SETTINGS
// ------------------------------------------

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

const GROUND_Y = 250;

let gameRunning = true;

let score = 0;
let highScore = 0;

let gameSpeed = 6;

let frameCount = 0;


// ------------------------------------------
// DINO
// ------------------------------------------

const dino = {

    x: 80,

    y: GROUND_Y - 50,

    width: 44,

    height: 50,

    velocityY: 0,

    gravity: 0.8,

    jumpStrength: -14,

    grounded: true,

    runFrame: 0,

    runTimer: 0,


    draw() {

        ctx.fillStyle = "#535353";


        // Body
        ctx.fillRect(
            this.x + 5,
            this.y + 15,
            28,
            30
        );


        // Head
        ctx.fillRect(
            this.x + 22,
            this.y,
            25,
            25
        );


        // Snout
        ctx.fillRect(
            this.x + 38,
            this.y + 10,
            12,
            10
        );


        // Eye
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            this.x + 38,
            this.y + 5,
            4,
            4
        );


        // Tail
        ctx.fillStyle = "#535353";

        ctx.fillRect(
            this.x,
            this.y + 25,
            12,
            8
        );

        ctx.fillRect(
            this.x - 6,
            this.y + 20,
            10,
            8
        );


        // Arms
        ctx.fillRect(
            this.x + 27,
            this.y + 27,
            12,
            5
        );


        // Legs

        if (this.grounded) {

            if (this.runFrame === 0) {

                // Left leg
                ctx.fillRect(
                    this.x + 10,
                    this.y + 42,
                    7,
                    10
                );

                // Right leg
                ctx.fillRect(
                    this.x + 27,
                    this.y + 40,
                    7,
                    12
                );

            } else {

                // Left leg
                ctx.fillRect(
                    this.x + 10,
                    this.y + 40,
                    7,
                    12
                );

                // Right leg
                ctx.fillRect(
                    this.x + 27,
                    this.y + 42,
                    7,
                    10
                );
            }

        } else {

            // Both legs raised while jumping
            ctx.fillRect(
                this.x + 10,
                this.y + 40,
                7,
                7
            );

            ctx.fillRect(
                this.x + 27,
                this.y + 40,
                7,
                7
            );
        }
    },


    update() {

        // Gravity
        this.velocityY += this.gravity;

        this.y += this.velocityY;


        // Ground collision
        if (this.y >= GROUND_Y - this.height) {

            this.y = GROUND_Y - this.height;

            this.velocityY = 0;

            this.grounded = true;

        } else {

            this.grounded = false;
        }


        // Running animation
        if (this.grounded) {

            this.runTimer++;

            if (this.runTimer >= 8) {

                this.runTimer = 0;

                this.runFrame =
                    this.runFrame === 0
                        ? 1
                        : 0;
            }
        }
    },


    jump() {

        if (!this.grounded || !gameRunning) {
            return;
        }


        this.velocityY = this.jumpStrength;

        this.grounded = false;
    }
};


// ------------------------------------------
// CACTUS
// ------------------------------------------

class Cactus {

    constructor() {

        this.width = 20;

        this.height =
            35 + Math.random() * 25;

        this.x =
            GAME_WIDTH + 20;

        this.y =
            GROUND_Y - this.height;
    }


    update() {

        this.x -= gameSpeed;
    }


    draw() {

        ctx.fillStyle = "#535353";


        // Main cactus
        ctx.fillRect(
            this.x,
            this.y,
            10,
            this.height
        );


        // Left branch
        if (this.height > 45) {

            ctx.fillRect(
                this.x - 8,
                this.y + 15,
                8,
                8
            );

            ctx.fillRect(
                this.x - 8,
                this.y + 8,
                6,
                15
            );
        }


        // Right branch
        if (this.height > 50) {

            ctx.fillRect(
                this.x + 10,
                this.y + 25,
                8,
                8
            );

            ctx.fillRect(
                this.x + 14,
                this.y + 15,
                6,
                18
            );
        }
    }


    isOffScreen() {

        return this.x + this.width < 0;
    }
}


// ------------------------------------------
// OBSTACLES
// ------------------------------------------

let obstacles = [];

let obstacleTimer = 0;

let nextObstacleTime = 100;


// ------------------------------------------
// CREATE OBSTACLE
// ------------------------------------------

function createObstacle() {

    obstacles.push(
        new Cactus()
    );
}


// ------------------------------------------
// UPDATE OBSTACLES
// ------------------------------------------

function updateObstacles() {

    obstacleTimer++;


    if (obstacleTimer >= nextObstacleTime) {

        createObstacle();

        obstacleTimer = 0;


        // Random distance between cacti
        nextObstacleTime =
            80 +
            Math.floor(
                Math.random() * 100
            );
    }


    for (const obstacle of obstacles) {

        obstacle.update();
    }


    obstacles =
        obstacles.filter(
            obstacle =>
                !obstacle.isOffScreen()
        );
}


// ------------------------------------------
// DRAW OBSTACLES
// ------------------------------------------

function drawObstacles() {

    for (const obstacle of obstacles) {

        obstacle.draw();
    }
}


// ------------------------------------------
// COLLISION DETECTION
// ------------------------------------------

function checkCollision() {

    // Slightly smaller hitbox
    // makes the game feel fairer.

    const dinoBox = {

        x: dino.x + 8,

        y: dino.y + 5,

        width: dino.width - 12,

        height: dino.height - 7
    };


    for (const obstacle of obstacles) {

        const cactusBox = {

            x: obstacle.x,

            y: obstacle.y,

            width: obstacle.width,

            height: obstacle.height
        };


        if (

            dinoBox.x <
                cactusBox.x +
                cactusBox.width &&

            dinoBox.x +
                dinoBox.width >
                cactusBox.x &&

            dinoBox.y <
                cactusBox.y +
                cactusBox.height &&

            dinoBox.y +
                dinoBox.height >
                cactusBox.y

        ) {

            gameOver();

            return;
        }
    }
}


// ------------------------------------------
// GROUND
// ------------------------------------------

let groundOffset = 0;


function updateGround() {

    groundOffset -= gameSpeed;


    if (groundOffset <= -40) {

        groundOffset = 0;
    }
}


function drawGround() {

    ctx.fillStyle = "#535353";


    // Main ground line

    ctx.fillRect(
        0,
        GROUND_Y,
        GAME_WIDTH,
        2
    );


    // Small ground pixels

    for (
        let x = groundOffset;
        x < GAME_WIDTH;
        x += 40
    ) {

        ctx.fillRect(
            x,
            GROUND_Y + 8,
            20,
            2
        );

        ctx.fillRect(
            x + 25,
            GROUND_Y + 15,
            8,
            2
        );
    }
}


// ------------------------------------------
// SCORE
// ------------------------------------------

function updateScore() {

    score += 0.1;

    const displayedScore =
        Math.floor(score);


    if (displayedScore > highScore) {

        highScore =
            displayedScore;
    }


    scoreElement.textContent =
        "HI " +
        String(highScore).padStart(5, "0") +
        "  " +
        String(displayedScore).padStart(5, "0");
}


// ------------------------------------------
// DIFFICULTY
// ------------------------------------------

function updateDifficulty() {

    // Slowly increase speed

    gameSpeed =
        6 +
        Math.floor(score / 100) * 0.5;


    // Maximum speed for now

    if (gameSpeed > 12) {

        gameSpeed = 12;
    }
}


// ------------------------------------------
// GAME OVER
// ------------------------------------------

function gameOver() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    gameOverElement.classList.remove(
        "hidden"
    );
}


// ------------------------------------------
// RESET GAME
// ------------------------------------------

function resetGame() {

    score = 0;

    gameSpeed = 6;

    frameCount = 0;

    obstacleTimer = 0;

    nextObstacleTime = 100;

    obstacles = [];


    dino.y =
        GROUND_Y -
        dino.height;

    dino.velocityY = 0;

    dino.grounded = true;


    gameRunning = true;


    gameOverElement.classList.add(
        "hidden"
    );
}


// ------------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------------

document.addEventListener(
    "keydown",
    function (event) {

        // Jump

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            if (!gameRunning) {

                resetGame();

            } else {

                dino.jump();
            }
        }
    }
);


// ------------------------------------------
// TOUCH CONTROLS
// ------------------------------------------

canvas.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();


        if (!gameRunning) {

            resetGame();

        } else {

            dino.jump();
        }
    },
    { passive: false }
);


// ------------------------------------------
// DRAW EVERYTHING
// ------------------------------------------

function draw() {

    // Clear canvas

    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    // Background

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    // Ground

    drawGround();


    // Dino

    dino.draw();


    // Obstacles

    drawObstacles();
}


// ------------------------------------------
// UPDATE EVERYTHING
// ------------------------------------------

function update() {

    if (!gameRunning) {
        return;
    }


    frameCount++;


    dino.update();

    updateObstacles();

    updateGround();

    checkCollision();

    updateScore();

    updateDifficulty();
}


// ------------------------------------------
// GAME LOOP
// ------------------------------------------

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );
}


// ------------------------------------------
// START GAME
// ------------------------------------------

gameLoop();
