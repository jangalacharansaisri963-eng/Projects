/**
 * Calculator UI controller.
 * All math is delegated to the Python engine via the bridge.
 */

import { Display } from "./display";
import { attachKeyboard } from "./keyboard";

export interface PythonBridge {
  evaluate(expression: string): Promise<{ ok: boolean; result: string | null; error: string | null }>;
  isReady(): boolean;
}

type ButtonDef = {
  label: string;
  value: string;
  className?: string;
};

const BUTTONS: ButtonDef[] = [
  { label: "C", value: "clear", className: "fn" },
  { label: "⌫", value: "backspace", className: "fn" },
  { label: "(", value: "(", className: "fn" },
  { label: ")", value: ")", className: "fn" },

  { label: "√", value: "sqrt(", className: "fn" },
  { label: "∛", value: "cbrt(", className: "fn" },
  { label: "xʸ", value: "**", className: "fn" },
  { label: "÷", value: "/", className: "op" },

  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "×", value: "*", className: "op" },

  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "−", value: "-", className: "op" },

  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "+", value: "+", className: "op" },

  { label: "0", value: "0", className: "zero" },
  { label: ".", value: "." },
  { label: "=", value: "=", className: "eq" },
];

export class Calculator {
  private display: Display;
  private bridge: PythonBridge;
  private keypad: HTMLElement;
  private waitingForNew = false;

  constructor(bridge: PythonBridge) {
    this.bridge = bridge;
    this.display = new Display("display-expression", "display-result");
    const kp = document.getElementById("keypad");
    if (!kp) throw new Error("Keypad element not found");
    this.keypad = kp;
    this.buildKeypad();
    attachKeyboard((key) => this.handleInput(key));
  }

  private buildKeypad(): void {
    this.keypad.innerHTML = "";
    for (const btn of BUTTONS) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `key${btn.className ? " " + btn.className : ""}`;
      el.textContent = btn.label;
      el.dataset.value = btn.value;
      el.addEventListener("click", () => this.handleInput(btn.value));
      this.keypad.appendChild(el);
    }
  }

  private handleInput(value: string): void {
    if (!this.bridge.isReady()) {
      this.display.setResult("Python not ready", true);
      return;
    }

    switch (value) {
      case "clear":
        this.display.clear();
        this.waitingForNew = false;
        break;
      case "backspace":
        this.display.backspace();
        this.waitingForNew = false;
        break;
      case "=":
        void this.evaluate();
        break;
      default:
        if (this.waitingForNew && /[0-9.]/.test(value)) {
          this.display.setExpression(value);
          this.display.setResult(value);
        } else {
          this.display.appendToExpression(value);
        }
        this.waitingForNew = false;
        break;
    }
  }

  private async evaluate(): Promise<void> {
    const expr = this.display.getExpression().trim();
    if (!expr) return;

    // Normalize UI symbols to Python
    const normalized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/\*\*/g, "**"); // already fine

    try {
      const response = await this.bridge.evaluate(normalized);
      if (response.ok && response.result != null) {
        this.display.setResult(response.result);
        this.display.setExpression(expr + " =");
        this.waitingForNew = true;
      } else {
        this.display.setResult(response.error ?? "Error", true);
        this.waitingForNew = true;
      }
    } catch (err) {
      this.display.setResult(String(err), true);
      this.waitingForNew = true;
    }
  }
}
