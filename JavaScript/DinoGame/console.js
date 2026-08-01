alert("CONSOLE.JS IS LOADED!");

const testButton = document.createElement("button");

testButton.textContent = "⌘";

testButton.style.position = "fixed";
testButton.style.right = "15px";
testButton.style.bottom = "15px";
testButton.style.width = "50px";
testButton.style.height = "50px";
testButton.style.zIndex = "99999";

document.body.appendChild(testButton);
