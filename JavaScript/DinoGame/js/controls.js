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

        // Jump

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            if (gameRunning) {

                dino.jump();

            } else {

                resetGame();
            }
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


        // Only jump while playing.
        // Do NOT restart by tapping the canvas.

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
// Useful when testing on a PC.

canvas.addEventListener(
    "mousedown",
    function () {

        if (gameRunning) {

            dino.jump();
        }
    }
);
