// ==========================================
// MY DINO GAME
// commands.js
// Developer Commands
// ==========================================


// ------------------------------------------
// COMMAND REGISTRY
// ------------------------------------------

const DEV_COMMANDS = {

    help: {

        description: "Show all developer commands.",

        execute() {

            consolePrint("Available commands:");

            consolePrint("/help");
            consolePrint("/clear");
            consolePrint("/speed <number>");
            consolePrint("/score <number>");
            consolePrint("/highscore <number>");
            consolePrint("/jump <number>");
            consolePrint("/gravity <number>");
            consolePrint("/spawn cactus");
            consolePrint("/clearobstacles");
            consolePrint("/god");
            consolePrint("/kill");
            consolePrint("/restart");
            consolePrint("/pause");
            consolePrint("/resume");
            consolePrint("/fps");
            consolePrint("/coords");
            consolePrint("/version");
            consolePrint("/about");
            consolePrint("/noclip");
            consolePrint("/freeze");
            consolePrint("/infinitejump");
            consolePrint("/hitbox");
            consolePrint("/debug");
            consolePrint("/teleport <x>");
        }
    },


    clear: {

        description: "Clear console.",

        execute() {

            consoleClear();
        }
    },


    speed: {

        description: "Set game speed.",

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /speed <number>"
                );

                return;
            }


            const value =
                Number(args[0]);


            if (!Number.isFinite(value)) {

                consolePrint(
                    "Invalid speed."
                );

                return;
            }


            if (value < 0) {

                consolePrint(
                    "Speed cannot be negative."
                );

                return;
            }


            gameSpeed = value;


            consolePrint(
                "Game speed set to " +
                value
            );
        }
    },


    score: {

        description: "Set current score.",

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /score <number>"
                );

                return;
            }


            const value =
                Number(args[0]);


            if (!Number.isFinite(value)) {

                consolePrint(
                    "Invalid score."
                );

                return;
            }


            if (value < 0) {

                consolePrint(
                    "Score cannot be negative."
                );

                return;
            }


            score = value;


            consolePrint(
                "Score set to " +
                Math.floor(value)
            );
        }
    },


    highscore: {

        description: "Set high score.",

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /highscore <number>"
                );

                return;
            }


            const value =
                Number(args[0]);


            if (
                !Number.isFinite(value) ||
                value < 0
            ) {

                consolePrint(
                    "Invalid high score."
                );

                return;
            }


            highScore = value;


            consolePrint(
                "High score set to " +
                Math.floor(value)
            );
        }
    },


    jump: {

        description: "Change Dino jump strength.",

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /jump <number>"
                );

                return;
            }


            const value =
                Number(args[0]);


            if (!Number.isFinite(value)) {

                consolePrint(
                    "Invalid jump strength."
                );

                return;
            }


            dino.jumpStrength = value;


            consolePrint(
                "Jump strength set to " +
                value
            );
        }
    },


    gravity: {

        description: "Change Dino gravity.",

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /gravity <number>"
                );

                return;
            }


            const value =
                Number(args[0]);


            if (!Number.isFinite(value)) {

                consolePrint(
                    "Invalid gravity."
                );

                return;
            }


            dino.gravity = value;


            consolePrint(
                "Gravity set to " +
                value
            );
        }
    },


    spawn: {

        description: "Spawn an obstacle.",

        execute(args) {

            if (
                args.length !== 1 ||
                args[0].toLowerCase() !== "cactus"
            ) {

                consolePrint(
                    "Usage: /spawn cactus"
                );

                return;
            }


            createObstacle();


            consolePrint(
                "Cactus spawned."
            );
        }
    },


    clearobstacles: {

        description: "Remove all obstacles.",

        execute() {

            obstacles = [];

            consolePrint(
                "All obstacles cleared."
            );
        }
    },


    god: {

        description: "Toggle invincibility.",

        execute() {

            godMode = !godMode;


            consolePrint(
                "God mode: " +
                (godMode ? "ON" : "OFF")
            );
        }
    },


    kill: {

        description: "Force Game Over.",

        execute() {

            gameOver();


            consolePrint(
                "Game Over triggered."
            );
        }
    },


    restart: {

        description: "Restart the game.",

        execute() {

            resetGame();


            consolePrint(
                "Game restarted."
            );
        }
    },


    pause: {

        description: "Pause the game.",

        execute() {

            gamePaused = true;


            consolePrint(
                "Game paused."
            );
        }
    },


    resume: {

        description: "Resume the game.",

        execute() {

            gamePaused = false;


            consolePrint(
                "Game resumed."
            );
        }
    },


    fps: {

        description: "Toggle FPS counter.",

        execute() {

            showFPS = !showFPS;


            consolePrint(
                "FPS display: " +
                (showFPS ? "ON" : "OFF")
            );
        }
    },


    coords: {

        description: "Show Dino coordinates.",

        execute() {

            consolePrint(
                "Dino X: " +
                dino.x
            );

            consolePrint(
                "Dino Y: " +
                dino.y
            );

            consolePrint(
                "Grounded: " +
                dino.grounded
            );
        }
    },


    version: {

        description: "Show game version.",

        execute() {

            consolePrint(
                "MY DINO GAME"
            );

            consolePrint(
                "Version 1.0"
            );
        }
    },


    about: {

        description: "Show game information.",

        execute() {

            consolePrint(
                "MY DINO GAME"
            );

            consolePrint(
                "A custom Chrome Dino-style game."
            );

            consolePrint(
                "Developer Console enabled."
            );
        }
    },


    noclip: {

        description: "Toggle collision detection.",

        execute() {

            noClip = !noClip;


            consolePrint(
                "Noclip: " +
                (noClip ? "ON" : "OFF")
            );
        }
    },


    freeze: {

        description: "Freeze/unfreeze Dino.",

        execute() {

            dinoFrozen = !dinoFrozen;


            consolePrint(
                "Dino freeze: " +
                (dinoFrozen ? "ON" : "OFF")
            );
        }
    },


    infinitejump: {

        description: "Toggle unlimited jumping.",

        execute() {

            infiniteJump =
                !infiniteJump;


            consolePrint(
                "Infinite jump: " +
                (
                    infiniteJump
                        ? "ON"
                        : "OFF"
                )
            );
        }
    },


    hitbox: {

        description: "Toggle collision hitboxes.",

        execute() {

            showHitbox =
                !showHitbox;


            consolePrint(
                "Hitboxes: " +
                (
                    showHitbox
                        ? "ON"
                        : "OFF"
                )
            );
        }
    },


    debug: {

        description: "Toggle debug information.",

        execute() {

            debugMode =
                !debugMode;


            consolePrint(
                "Debug mode: " +
                (
                    debugMode
                        ? "ON"
                        : "OFF"
                )
            );
        }
    },


    teleport: {

        description: "Move Dino horizontally.",

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /teleport <x>"
                );

                return;
            }


            const value =
                Number(args[0]);


            if (!Number.isFinite(value)) {

                consolePrint(
                    "Invalid X coordinate."
                );

                return;
            }


            dino.x = value;


            consolePrint(
                "Dino teleported to X=" +
                value
            );
        }
    }
};


// ------------------------------------------
// DEVELOPER VARIABLES
// ------------------------------------------

let godMode = false;

let noClip = false;

let dinoFrozen = false;

let infiniteJump = false;

let showHitbox = false;

let debugMode = false;

let showFPS = false;

let gamePaused = false;


// ------------------------------------------
// COMMAND EXECUTOR
// ------------------------------------------

function executeCommand(input) {

    const trimmed =
        input.trim();


    if (trimmed === "") {

        return;
    }


    // Remove leading slash

    const commandText =
        trimmed.startsWith("/")
            ? trimmed.substring(1)
            : trimmed;


    const parts =
        commandText.split(/\s+/);


    const commandName =
        parts.shift().toLowerCase();


    const args = parts;


    const command =
        DEV_COMMANDS[commandName];


    // Unknown command

    if (!command) {

        consolePrint(
            "Unknown command: /" +
            commandName
        );

        consolePrint(
            "Type /help for commands."
        );

        return;
    }


    // Execute

    try {

        command.execute(args);

    } catch (error) {

        consolePrint(
            "Command error: " +
            error.message
        );

        console.error(error);
    }
        }
