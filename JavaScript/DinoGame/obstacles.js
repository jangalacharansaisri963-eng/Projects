// ==========================================
// MY DINO GAME
// obstacles.js
// File 3/5
// ==========================================


// ------------------------------------------
// CACTUS
// ------------------------------------------

class Cactus {

    constructor(options = {}) {

        this.width = options.width || 20;

        this.height =
            options.height ||
            this.getRandomHeight();

        this.x =
            options.x ??
            GAME_WIDTH + 20;

        this.y =
            GROUND_Y - this.height;
    }


    // --------------------------------------
    // RANDOM HEIGHT
    // --------------------------------------

    getRandomHeight() {

        // ----------------------------------
        // EARLY GAME
        // ----------------------------------

        if (score < 500) {

            return (
                35 +
                Math.random() * 25
            );
        }


        // ----------------------------------
        // 500+
        // ----------------------------------

        if (score < 1000) {

            return (
                40 +
                Math.random() * 30
            );
        }


        // ----------------------------------
        // 1,000+
        // ----------------------------------

        if (score < 5000) {

            return (
                45 +
                Math.random() * 35
            );
        }


        // ----------------------------------
        // 5,000+
        // ----------------------------------

        if (score < 10000) {

            return (
                50 +
                Math.random() * 35
            );
        }


        // ----------------------------------
        // 10,000+
        // ----------------------------------

        if (score < 100000) {

            return (
                55 +
                Math.random() * 40
            );
        }


        // ----------------------------------
        // 100,000+
        // ----------------------------------

        return (
            60 +
            Math.random() * 45
        );
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


        // ----------------------------------
        // MAIN CACTUS
        // ----------------------------------

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


        // ----------------------------------
        // DEBUG HITBOX
        // ----------------------------------

        if (showHitbox) {

            ctx.strokeStyle = "#ff0000";

            ctx.lineWidth = 1;

            ctx.strokeRect(
                this.x,
                this.y,
                this.width,
                this.height
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


// ==========================================
// CREATE OBSTACLE
// ==========================================

function createObstacle() {

    const firstCactus =
        new Cactus();

    obstacles.push(
        firstCactus
    );


    // --------------------------------------
    // DOUBLE CACTUS
    // --------------------------------------

    if (
        score >= 5000 &&
        Math.random() < 0.20
    ) {

        const spacing = 35;

        const secondCactus =
            new Cactus({
                x:
                    firstCactus.x +
                    firstCactus.width +
                    spacing
            });

        obstacles.push(
            secondCactus
        );
    }


    // --------------------------------------
    // TRIPLE CACTUS
    // --------------------------------------

    if (
        score >= 50000 &&
        Math.random() < 0.10
    ) {

        const spacing = 35;

        const lastObstacle =
            obstacles[
                obstacles.length - 1
            ];

        const thirdCactus =
            new Cactus({
                x:
                    lastObstacle.x +
                    lastObstacle.width +
                    spacing
            });

        obstacles.push(
            thirdCactus
        );
    }
}


// ==========================================
// OBSTACLE SPAWN DISTANCE
// ==========================================

function getNextObstacleTime() {

    // --------------------------------------
    // EASY
    // --------------------------------------

    if (score < 500) {

        return (
            80 +
            Math.floor(
                Math.random() * 100
            )
        );
    }


    // --------------------------------------
    // 500+
    // --------------------------------------

    if (score < 1000) {

        return (
            75 +
            Math.floor(
                Math.random() * 90
            )
        );
    }


    // --------------------------------------
    // 1,000+
    // --------------------------------------

    if (score < 5000) {

        return (
            70 +
            Math.floor(
                Math.random() * 80
            )
        );
    }


    // --------------------------------------
    // 5,000+
    // --------------------------------------

    if (score < 10000) {

        return (
            65 +
            Math.floor(
                Math.random() * 70
            )
        );
    }


    // --------------------------------------
    // 10,000+
    // --------------------------------------

    if (score < 100000) {

        return (
            60 +
            Math.floor(
                Math.random() * 60
            )
        );
    }


    // --------------------------------------
    // 100,000+
    // --------------------------------------

    if (score < 1000000) {

        return (
            55 +
            Math.floor(
                Math.random() * 55
            )
        );
    }


    // --------------------------------------
    // 1 MILLION+
    // --------------------------------------

    return (
        50 +
        Math.floor(
            Math.random() * 45
        )
    );
}


// ==========================================
// UPDATE OBSTACLES
// ==========================================

function updateObstacles() {

    // Don't update obstacles
    // while paused.

    if (gamePaused) {

        return;
    }


    obstacleTimer++;


    // --------------------------------------
    // SPAWN
    // --------------------------------------

    if (
        obstacleTimer >=
        nextObstacleTime
    ) {

        createObstacle();

        obstacleTimer = 0;


        nextObstacleTime =
            getNextObstacleTime();
    }


    // --------------------------------------
    // MOVE OBSTACLES
    // --------------------------------------

    for (
        const obstacle of obstacles
    ) {

        obstacle.update();
    }


    // --------------------------------------
    // REMOVE OLD OBSTACLES
    // --------------------------------------

    obstacles =
        obstacles.filter(
            obstacle =>
                !obstacle.isOffScreen()
        );
}


// ==========================================
// DRAW OBSTACLES
// ==========================================

function drawObstacles() {

    for (
        const obstacle of obstacles
    ) {

        obstacle.draw();
    }
}


// ==========================================
// COLLISION DETECTION
// ==========================================

function checkCollision() {

    // --------------------------------------
    // GOD MODE / NOCLIP
    // --------------------------------------

    if (
        godMode ||
        noClip
    ) {

        return;
    }


    // --------------------------------------
    // DINO HITBOX
    // --------------------------------------

    const dinoBox = {

        x:
            dino.x + 8,

        y:
            dino.y + 5,

        width:
            dino.width - 12,

        height:
            dino.height - 7
    };


    // --------------------------------------
    // CHECK EVERY OBSTACLE
    // --------------------------------------

    for (
        const obstacle of obstacles
    ) {

        const cactusBox = {

            x:
                obstacle.x,

            y:
                obstacle.y,

            width:
                obstacle.width,

            height:
                obstacle.height
        };


        // ----------------------------------
        // RECTANGLE COLLISION
        // ----------------------------------

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
