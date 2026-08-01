// ==========================================
// MY DINO GAME
// game.js
// File 4/5
// ==========================================


// ------------------------------------------
// GROUND
// ------------------------------------------

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


    // Maximum speed

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

    groundOffset = 0;

    obstacleTimer = 0;

    nextObstacleTime = 100;

    obstacles = [];


    // Reset Dino

    dino.y =
        GROUND_Y -
        dino.height;

    dino.velocityY = 0;

    dino.grounded = true;

    dino.runFrame = 0;

    dino.runTimer = 0;


    // Start game

    gameRunning = true;


    gameOverElement.classList.add(
        "hidden"
    );
}


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


    // Update Dino

    dino.update();


    // Update obstacles

    updateObstacles();


    // Update ground

    updateGround();


    // Collision

    checkCollision();


    // Score

    updateScore();


    // Difficulty

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
