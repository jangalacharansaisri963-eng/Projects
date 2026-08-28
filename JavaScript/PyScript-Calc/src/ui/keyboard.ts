/**
 * Physical keyboard support for the calculator.
 */

export type KeyHandler = (key: string) => void;

const KEY_MAP: Record<string, string> = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  ".": ".",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  "^": "**",
  "(": "(",
  ")": ")",
  "!": "!",
  Enter: "=",
  "=": "=",
  Backspace: "backspace",
  Delete: "clear",
  Escape: "clear",
  c: "clear",
  C: "clear",
};

export function attachKeyboard(handler: KeyHandler): () => void {
  const listener = (e: KeyboardEvent) => {
    // Ignore when terminal panel is active or typing in an input
    const termPanel = document.getElementById("panel-terminal");
    if (termPanel && termPanel.classList.contains("active")) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
      return;
    }

    const mapped = KEY_MAP[e.key];
    if (mapped) {
      e.preventDefault();
      handler(mapped);
    }
  };

  window.addEventListener("keydown", listener);
  return () => window.removeEventListener("keydown", listener);
}
