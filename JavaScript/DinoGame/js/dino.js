// ==========================================
// MY DINO GAME
// dino.js
// File 2/5
// ==========================================


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


    // --------------------------------------
    // DRAW DINO
    // --------------------------------------

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


        // ----------------------------------
        // LEGS
        // ----------------------------------

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


    // --------------------------------------
    // UPDATE DINO
    // --------------------------------------

    update() {

        // Gravity
        this.velocityY += this.gravity;

        this.y += this.velocityY;


        // ----------------------------------
        // GROUND COLLISION
        // ----------------------------------

        if (
            this.y >=
            GROUND_Y - this.height
        ) {

            this.y =
                GROUND_Y - this.height;

            this.velocityY = 0;

            this.grounded = true;

        } else {

            this.grounded = false;
        }


        // ----------------------------------
        // RUNNING ANIMATION
        // ----------------------------------

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


    // --------------------------------------
    // JUMP
    // --------------------------------------

    jump() {

        if (
            !this.grounded ||
            !gameRunning
        ) {
            return;
        }


        this.velocityY =
            this.jumpStrength;

        this.grounded = false;
    }
};
