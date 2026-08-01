// ==========================================
// MY DINO GAME
// console.js
// Developer Console UI
// ==========================================


// ------------------------------------------
// CREATE CONSOLE UI
// ------------------------------------------

const consoleToggle =
    document.createElement("button");

consoleToggle.id = "console-toggle";

consoleToggle.textContent = "⌘";

consoleToggle.title =
    "Open Developer Console";


const devConsole =
    document.createElement("div");

devConsole.id = "dev-console";


// ------------------------------------------
// CONSOLE HEADER
// ------------------------------------------

const consoleHeader =
    document.createElement("div");

consoleHeader.id = "console-header";


const consoleTitle =
    document.createElement("span");

consoleTitle.id = "console-title";

consoleTitle.textContent =
    "DEVELOPER CONSOLE";


const consoleClose =
    document.createElement("button");

consoleClose.id = "console-close";

consoleClose.textContent = "×";

consoleClose.title =
    "Close Console";


consoleHeader.appendChild(
    consoleTitle
);

consoleHeader.appendChild(
    consoleClose
);


// ------------------------------------------
// CONSOLE OUTPUT
// ------------------------------------------

const consoleOutput =
    document.createElement("div");

consoleOutput.id = "console-output";


// ------------------------------------------
// CONSOLE INPUT AREA
// ------------------------------------------

const consoleInputArea =
    document.createElement("div");

consoleInputArea.id =
    "console-input-area";


const consoleInput =
    document.createElement("input");

consoleInput.id =
    "console-input";

consoleInput.type = "text";

consoleInput.placeholder =
    "Type a command...";

consoleInput.autocomplete =
    "off";

consoleInput.spellcheck = false;


const consoleSubmit =
    document.createElement("button");

consoleSubmit.id =
    "console-submit";

consoleSubmit.textContent =
    "SEND";


// Add input elements

consoleInputArea.appendChild(
    consoleInput
);

consoleInputArea.appendChild(
    consoleSubmit
);


// ------------------------------------------
// BUILD CONSOLE
// ------------------------------------------

devConsole.appendChild(
    consoleHeader
);

devConsole.appendChild(
    consoleOutput
);

devConsole.appendChild(
    consoleInputArea
);


// Add to page

document.body.appendChild(
    consoleToggle
);

document.body.appendChild(
    devConsole
);


// ------------------------------------------
// CONSOLE STATE
// ------------------------------------------

let consoleOpen = false;


// ------------------------------------------
// OPEN CONSOLE
// ------------------------------------------

function openConsole() {

    consoleOpen = true;

    devConsole.classList.add(
        "open"
    );

    consoleInput.focus();
}


// ------------------------------------------
// CLOSE CONSOLE
// ------------------------------------------

function closeConsole() {

    consoleOpen = false;

    devConsole.classList.remove(
        "open"
    );

    consoleInput.blur();
}


// ------------------------------------------
// TOGGLE CONSOLE
// ------------------------------------------

function toggleConsole() {

    if (consoleOpen) {

        closeConsole();

    } else {

        openConsole();
    }
}


// ------------------------------------------
// CONSOLE TOGGLE BUTTON
// ------------------------------------------

consoleToggle.addEventListener(
    "click",
    function () {

        toggleConsole();
    }
);


// ------------------------------------------
// CLOSE BUTTON
// ------------------------------------------

consoleClose.addEventListener(
    "click",
    function () {

        closeConsole();
    }
);


// ------------------------------------------
// PRINT TO CONSOLE
// ------------------------------------------

function consolePrint(message) {

    const line =
        document.createElement("div");

    line.textContent =
        String(message);

    consoleOutput.appendChild(
        line
    );


    // Automatically scroll down

    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}


// ------------------------------------------
// CLEAR CONSOLE
// ------------------------------------------

function consoleClear() {

    consoleOutput.innerHTML = "";
}


// ------------------------------------------
// EXECUTE COMMAND
// ------------------------------------------

function submitConsoleCommand() {

    const command =
        consoleInput.value.trim();


    // Nothing entered

    if (command === "") {

        return;
    }


    // Show entered command

    consolePrint(
        "> " + command
    );


    // Send command to commands.js

    if (
        typeof executeCommand ===
        "function"
    ) {

        executeCommand(command);

    } else {

        consolePrint(
            "Command system not loaded."
        );
    }


    // Clear input

    consoleInput.value = "";

    consoleInput.focus();
}


// ------------------------------------------
// SEND BUTTON
// ------------------------------------------

consoleSubmit.addEventListener(
    "click",
    function () {

        submitConsoleCommand();
    }
);


// ------------------------------------------
// ENTER KEY
// ------------------------------------------

consoleInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            submitConsoleCommand();
        }
    }
);


// ------------------------------------------
// INITIAL MESSAGE
// ------------------------------------------

consolePrint(
    "Developer Console initialized."
);
