// ==========================================
// MY DINO GAME
// console.js
// Developer Console + Commands
// Version 1.0
// ==========================================


// ==========================================
// DEVELOPER VARIABLES
// ==========================================

let godMode = false;
let noClip = false;
let dinoFrozen = false;
let infiniteJump = false;
let showHitbox = false;
let debugMode = false;
let showFPS = false;
let gamePaused = false;


// ==========================================
// CONSOLE UI
// ==========================================

const consoleToggle = document.createElement("button");

consoleToggle.id = "console-toggle";
consoleToggle.textContent = "⌘";
consoleToggle.title = "Open Developer Console";


const devConsole = document.createElement("div");

devConsole.id = "dev-console";


// ==========================================
// HEADER
// ==========================================

const consoleHeader = document.createElement("div");

consoleHeader.id = "console-header";


const consoleTitle = document.createElement("span");

consoleTitle.id = "console-title";
consoleTitle.textContent = "DEVELOPER CONSOLE";


const consoleClose = document.createElement("button");

consoleClose.id = "console-close";
consoleClose.textContent = "×";
consoleClose.title = "Close Console";


consoleHeader.appendChild(consoleTitle);
consoleHeader.appendChild(consoleClose);


// ==========================================
// OUTPUT
// ==========================================

const consoleOutput = document.createElement("div");

consoleOutput.id = "console-output";


// ==========================================
// INPUT AREA
// ==========================================

const consoleInputArea = document.createElement("div");

consoleInputArea.id = "console-input-area";


const consoleInput = document.createElement("input");

consoleInput.id = "console-input";
consoleInput.type = "text";
consoleInput.placeholder = "Type a command...";
consoleInput.autocomplete = "off";
consoleInput.spellcheck = false;


const consoleSubmit = document.createElement("button");

consoleSubmit.id = "console-submit";
consoleSubmit.type = "button";
consoleSubmit.textContent = "SEND";


consoleInputArea.appendChild(consoleInput);
consoleInputArea.appendChild(consoleSubmit);


// ==========================================
// BUILD CONSOLE
// ==========================================

devConsole.appendChild(consoleHeader);
devConsole.appendChild(consoleOutput);
devConsole.appendChild(consoleInputArea);

document.body.appendChild(consoleToggle);
document.body.appendChild(devConsole);


// ==========================================
// CONSOLE STATE
// ==========================================

let consoleOpen = false;


// ==========================================
// OPEN CONSOLE
// ==========================================

function openConsole() {

    consoleOpen = true;

    devConsole.classList.add("open");

    consoleInput.focus();
}


// ==========================================
// CLOSE CONSOLE
// ==========================================

function closeConsole() {

    consoleOpen = false;

    devConsole.classList.remove("open");

    consoleInput.blur();
}


// ==========================================
// TOGGLE CONSOLE
// ==========================================

function toggleConsole() {

    if (consoleOpen) {

        closeConsole();

    } else {

        openConsole();
    }
}


// ==========================================
// PRINT
// ==========================================

function consolePrint(message) {

    const line = document.createElement("div");

    line.textContent = String(message);

    consoleOutput.appendChild(line);

    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}


// ==========================================
// CLEAR
// ==========================================

function consoleClear() {

    consoleOutput.innerHTML = "";
}


// ==========================================
// COMMAND REGISTRY
// ==========================================

const DEV_COMMANDS = {

    // --------------------------------------
    // HELP
    // --------------------------------------

    help: {

        execute() {

            consolePrint("==============================");
            consolePrint("MY DINO GAME - COMMANDS");
            consolePrint("==============================");

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

            consolePrint("==============================");
        }
    },


    // --------------------------------------
    // CLEAR
    // --------------------------------------

    clear: {

        execute() {

            consoleClear();
        }
    },


    // --------------------------------------
    // SPEED
    // --------------------------------------

    speed: {

        execute(args) {

            if (args.length !== 1) {

                consolePrint("Usage: /speed <number>");
                return;
            }

            const value = Number(args[0]);

            if (!Number.isFinite(value) || value < 0) {

                consolePrint("Invalid speed.");
                return;
            }

            gameSpeed = value;

            consolePrint(
                "Game speed set to " + value
            );
        }
    },


    // --------------------------------------
    // SCORE
    // --------------------------------------

    score: {

        execute(args) {

            if (args.length !== 1) {

                consolePrint("Usage: /score <number>");
                return;
            }

            const value = Number(args[0]);

            if (!Number.isFinite(value) || value < 0) {

                consolePrint("Invalid score.");
                return;
            }

            score = value;

            consolePrint(
                "Score set to " + Math.floor(value)
            );
        }
    },


    // --------------------------------------
    // HIGH SCORE
    // --------------------------------------

    highscore: {

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /highscore <number>"
                );

                return;
            }

            const value = Number(args[0]);

            if (!Number.isFinite(value) || value < 0) {

                consolePrint("Invalid high score.");
                return;
            }

            highScore = value;

            consolePrint(
                "High score set to " +
                Math.floor(value)
            );
        }
    },


    // --------------------------------------
    // JUMP
    // --------------------------------------

    jump: {

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /jump <number>"
                );

                return;
            }

            const value = Number(args[0]);

            if (!Number.isFinite(value)) {

                consolePrint(
                    "Invalid jump strength."
                );

                return;
            }

            dino.jumpStrength = value;

            consolePrint(
                "Jump strength set to " + value
            );
        }
    },


    // --------------------------------------
    // GRAVITY
    // --------------------------------------

    gravity: {

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /gravity <number>"
                );

                return;
            }

            const value = Number(args[0]);

            if (!Number.isFinite(value)) {

                consolePrint("Invalid gravity.");
                return;
            }

            dino.gravity = value;

            consolePrint(
                "Gravity set to " + value
            );
        }
    },


    // --------------------------------------
    // SPAWN
    // --------------------------------------

    spawn: {

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

            consolePrint("Cactus spawned.");
        }
    },


    // --------------------------------------
    // CLEAR OBSTACLES
    // --------------------------------------

    clearobstacles: {

        execute() {

            obstacles = [];

            consolePrint(
                "All obstacles cleared."
            );
        }
    },


    // --------------------------------------
    // GOD
    // --------------------------------------

    god: {

        execute() {

            godMode = !godMode;

            consolePrint(
                "God mode: " +
                (godMode ? "ON" : "OFF")
            );
        }
    },


    // --------------------------------------
    // KILL
    // --------------------------------------

    kill: {

        execute() {

            gameOver();

            consolePrint(
                "Game Over triggered."
            );
        }
    },


    // --------------------------------------
    // RESTART
    // --------------------------------------

    restart: {

        execute() {

            resetGame();

            gamePaused = false;

            consolePrint(
                "Game restarted."
            );
        }
    },


    // --------------------------------------
    // PAUSE
    // --------------------------------------

    pause: {

        execute() {

            gamePaused = true;

            consolePrint(
                "Game paused."
            );
        }
    },


    // --------------------------------------
    // RESUME
    // --------------------------------------

    resume: {

        execute() {

            gamePaused = false;

            consolePrint(
                "Game resumed."
            );
        }
    },


    // --------------------------------------
    // FPS
    // --------------------------------------

    fps: {

        execute() {

            showFPS = !showFPS;

            consolePrint(
                "FPS display: " +
                (showFPS ? "ON" : "OFF")
            );
        }
    },


    // --------------------------------------
    // COORDS
    // --------------------------------------

    coords: {

        execute() {

            consolePrint(
                "Dino X: " + dino.x
            );

            consolePrint(
                "Dino Y: " + dino.y
            );

            consolePrint(
                "Grounded: " + dino.grounded
            );
        }
    },


    // --------------------------------------
    // VERSION
    // --------------------------------------

    version: {

        execute() {

            consolePrint("MY DINO GAME");
            consolePrint("Version 1.0");
        }
    },


    // --------------------------------------
    // ABOUT
    // --------------------------------------

    about: {

        execute() {

            consolePrint("MY DINO GAME");

            consolePrint(
                "A custom Chrome Dino-style game."
            );

            consolePrint(
                "Developer Console enabled."
            );
        }
    },


    // --------------------------------------
    // NOCLIP
    // --------------------------------------

    noclip: {

        execute() {

            noClip = !noClip;

            consolePrint(
                "Noclip: " +
                (noClip ? "ON" : "OFF")
            );
        }
    },


    // --------------------------------------
    // FREEZE
    // --------------------------------------

    freeze: {

        execute() {

            dinoFrozen = !dinoFrozen;

            consolePrint(
                "Dino freeze: " +
                (dinoFrozen ? "ON" : "OFF")
            );
        }
    },


    // --------------------------------------
    // INFINITE JUMP
    // --------------------------------------

    infinitejump: {

        execute() {

            infiniteJump = !infiniteJump;

            consolePrint(
                "Infinite jump: " +
                (infiniteJump ? "ON" : "OFF")
            );
        }
    },


    // --------------------------------------
    // HITBOX
    // --------------------------------------

    hitbox: {

        execute() {

            showHitbox = !showHitbox;

            consolePrint(
                "Hitboxes: " +
                (showHitbox ? "ON" : "OFF")
            );
        }
    },


    // --------------------------------------
    // DEBUG
    // --------------------------------------

    debug: {

        execute() {

            debugMode = !debugMode;

            consolePrint(
                "Debug mode: " +
                (debugMode ? "ON" : "OFF")
            );
        }
    },


    // --------------------------------------
    // TELEPORT
    // --------------------------------------

    teleport: {

        execute(args) {

            if (args.length !== 1) {

                consolePrint(
                    "Usage: /teleport <x>"
                );

                return;
            }

            const value = Number(args[0]);

            if (!Number.isFinite(value)) {

                consolePrint(
                    "Invalid X coordinate."
                );

                return;
            }

            dino.x = value;

            consolePrint(
                "Dino teleported to X=" + value
            );
        }
    }
};


// ==========================================
// COMMAND EXECUTOR
// ==========================================

function executeCommand(input) {

    const trimmed = input.trim();

    if (trimmed === "") {
        return;
    }

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


// ==========================================
// SUBMIT COMMAND
// ==========================================

function submitConsoleCommand() {

    const command =
        consoleInput.value.trim();

    if (command === "") {
        return;
    }

    consolePrint("> " + command);

    executeCommand(command);

    consoleInput.value = "";

    consoleInput.focus();
}


// ==========================================
// BUTTON EVENTS
// ==========================================

consoleToggle.addEventListener(
    "click",
    function () {

        toggleConsole();
    }
);


consoleClose.addEventListener(
    "click",
    function () {

        closeConsole();
    }
);


consoleSubmit.addEventListener(
    "click",
    function () {

        submitConsoleCommand();
    }
);


// ==========================================
// ENTER KEY
// ==========================================

consoleInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            submitConsoleCommand();
        }
    }
);


// ==========================================
// KEYBOARD SHORTCUT
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        // Backtick opens/closes console

        if (
            event.key === "`" &&
            document.activeElement !== consoleInput
        ) {

            event.preventDefault();

            toggleConsole();
        }
    }
);


// ==========================================
// INITIAL MESSAGE
// ==========================================

consolePrint(
    "Developer Console initialized."
);

consolePrint(
    "Type /help for commands."
);
