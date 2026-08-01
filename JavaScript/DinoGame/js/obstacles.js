// ==========================================
// MY DINO GAME
// obstacles.js
// File 3/5
// ==========================================


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


    // --------------------------------------
    // UPDATE CACTUS
    // --------------------------------------

    update() {

        this.x -= gameSpeed;
    }


    // --------------------------------------
    // DRAW CACTUS
    // --------------------------------------

    draw() {

        ctx.fillStyle = "#535353";


        // Main cactus
        ctx.fillRect(
            this.x,
            this.y,
            10,
            this.height
        );


        // ----------------------------------
        // LEFT BRANCH
        // ----------------------------------

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


        // ----------------------------------
        // RIGHT BRANCH
        // ----------------------------------

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


    // --------------------------------------
    // OFF-SCREEN CHECK
    // --------------------------------------

    isOffScreen() {

        return (
            this.x + this.width < 0
        );
    }
}


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


    // Create a new cactus

    if (
        obstacleTimer >=
        nextObstacleTime
    ) {

        createObstacle();

        obstacleTimer = 0;


        // Random distance between cacti

        nextObstacleTime =
            80 +
            Math.floor(
                Math.random() * 100
            );
    }


    // Move all obstacles

    for (
        const obstacle of obstacles
    ) {

        obstacle.update();
    }


    // Remove obstacles that left
    // the screen

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

    for (
        const obstacle of obstacles
    ) {

        obstacle.draw();
    }
}


// ------------------------------------------
// COLLISION DETECTION
// ------------------------------------------

function checkCollision() {

    // Slightly smaller Dino hitbox
    // makes the game feel fairer.

    const dinoBox = {

        x: dino.x + 8,

        y: dino.y + 5,

        width: dino.width - 12,

        height: dino.height - 7
    };


    // Check every cactus

    for (
        const obstacle of obstacles
    ) {

        const cactusBox = {

            x: obstacle.x,

            y: obstacle.y,

            width: obstacle.width,

            height: obstacle.height
        };


        // Rectangle collision

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
