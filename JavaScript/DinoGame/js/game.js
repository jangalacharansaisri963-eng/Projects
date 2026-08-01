// ==========================================
// MY DINO GAME
// game.js
// File 4/5
// ==========================================


// ------------------------------------------
// FPS TRACKING
// ------------------------------------------

let fps = 0;

let fpsFrameCount = 0;

let fpsLastTime = performance.now();


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

    // Don't automatically overwrite
    // developer-controlled speed.

    if (debugMode) {

        return;
    }


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

    dino.x = 80;

    dino.y =
        GROUND_Y -
        dino.height;

    dino.velocityY = 0;

    dino.grounded = true;

    dino.runFrame = 0;

    dino.runTimer = 0;


    // Reset game state

    gameRunning = true;

    gamePaused = false;


    gameOverElement.classList.add(
        "hidden"
    );
}


// ------------------------------------------
// DEBUG INFORMATION
// ------------------------------------------

function drawDebugInfo() {

    if (!debugMode) {

        return;
    }


    ctx.fillStyle = "#535353";

    ctx.font =
        "12px monospace";


    const lines = [

        "DEBUG MODE",

        "FPS: " + fps,

        "Speed: " + gameSpeed,

        "Score: " + Math.floor(score),

        "Dino X: " + Math.floor(dino.x),

        "Dino Y: " + Math.floor(dino.y),

        "Velocity Y: " +
            dino.velocityY.toFixed(2),

        "Grounded: " + dino.grounded,

        "Obstacles: " + obstacles.length,

        "God: " + godMode,

        "Noclip: " + noClip,

        "Frozen: " + dinoFrozen,

        "Infinite Jump: " +
            infiniteJump
    ];


    let y = 20;


    for (const line of lines) {

        ctx.fillText(
            line,
            10,
            y
        );

        y += 15;
    }
}


// ------------------------------------------
// FPS CALCULATION
// ------------------------------------------

function updateFPS() {

    fpsFrameCount++;


    const currentTime =
        performance.now();


    const elapsed =
        currentTime -
        fpsLastTime;


    if (elapsed >= 1000) {

        fps = fpsFrameCount;

        fpsFrameCount = 0;

        fpsLastTime = currentTime;
    }
}


// ------------------------------------------
// FPS DISPLAY
// ------------------------------------------

function drawFPS() {

    if (!showFPS) {

        return;
    }


    ctx.fillStyle = "#535353";

    ctx.font =
        "14px monospace";


    ctx.fillText(
        "FPS: " + fps,
        GAME_WIDTH - 80,
        20
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


    // Developer information

    drawDebugInfo();

    drawFPS();
}


// ------------------------------------------
// UPDATE EVERYTHING
// ------------------------------------------

function update() {

    updateFPS();


    // Game Over

    if (!gameRunning) {

        return;
    }


    // Developer pause

    if (gamePaused) {

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
