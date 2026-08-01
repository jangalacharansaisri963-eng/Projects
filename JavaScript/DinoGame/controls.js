// ==========================================
// MY DINO GAME
// controls.js
// File 5/5
// ==========================================


// ------------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------------

document.addEventListener(
    "keydown",
    function (event) {

        // ----------------------------------
        // JUMP
        // ----------------------------------

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            // Don't jump while console input
            // is being used.

            if (
                document.activeElement &&
                (
                    document.activeElement.tagName ===
                    "INPUT" ||

                    document.activeElement.tagName ===
                    "TEXTAREA"
                )
            ) {

                return;
            }


            // Game Over

            if (!gameRunning) {

                resetGame();

                return;
            }


            // Paused

            if (gamePaused) {

                return;
            }


            // Jump

            dino.jump();
        }
    }
);


// ------------------------------------------
// MOBILE TOUCH CONTROLS
// ------------------------------------------

canvas.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();


        // Don't jump while paused

        if (gamePaused) {

            return;
        }


        // Only jump while game is running

        if (gameRunning) {

            dino.jump();
        }

    },
    {
        passive: false
    }
);


// ------------------------------------------
// RESTART BUTTON
// ------------------------------------------

restartButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();


        resetGame();
    }
);


// ------------------------------------------
// MOUSE SUPPORT
// ------------------------------------------
// Useful when testing on PC.

canvas.addEventListener(
    "mousedown",
    function (event) {

        event.preventDefault();


        // Don't jump while paused

        if (gamePaused) {

            return;
        }


        // Jump

        if (gameRunning) {

            dino.jump();
        }
    }
);


// ------------------------------------------
// DOUBLE-CLICK PREVENTION
// ------------------------------------------

canvas.addEventListener(
    "dblclick",
    function (event) {

        event.preventDefault();
    }
);
