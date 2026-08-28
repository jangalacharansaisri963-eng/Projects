/**
 * Calculator UI controller – scientific keypad.
 * All math is delegated to the pure-Python engine via the bridge.
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

/** Basic 4-column layout */
const BASIC_BUTTONS: ButtonDef[] = [
  { label: "C", value: "clear", className: "fn danger" },
  { label: "⌫", value: "backspace", className: "fn" },
  { label: "(", value: "(", className: "fn" },
  { label: ")", value: ")", className: "fn" },

  { label: "√", value: "sqrt(", className: "fn" },
  { label: "x²", value: "**2", className: "fn" },
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

  { label: "0", value: "0" },
  { label: ".", value: "." },
  { label: "n!", value: "!", className: "fn" },
  { label: "=", value: "=", className: "eq" },
];

/** Scientific 5-column layout */
const SCI_BUTTONS: ButtonDef[] = [
  { label: "C", value: "clear", className: "fn danger" },
  { label: "⌫", value: "backspace", className: "fn" },
  { label: "(", value: "(", className: "fn" },
  { label: ")", value: ")", className: "fn" },
  { label: "÷", value: "/", className: "op" },

  { label: "sin", value: "sin(", className: "fn" },
  { label: "cos", value: "cos(", className: "fn" },
  { label: "tan", value: "tan(", className: "fn" },
  { label: "ln", value: "ln(", className: "fn" },
  { label: "log", value: "log(", className: "fn" },

  { label: "sin⁻¹", value: "asin(", className: "fn" },
  { label: "cos⁻¹", value: "acos(", className: "fn" },
  { label: "tan⁻¹", value: "atan(", className: "fn" },
  { label: "log₁₀", value: "log10(", className: "fn" },
  { label: "log₂", value: "log2(", className: "fn" },

  { label: "sinh", value: "sinh(", className: "fn" },
  { label: "cosh", value: "cosh(", className: "fn" },
  { label: "tanh", value: "tanh(", className: "fn" },
  { label: "√", value: "sqrt(", className: "fn" },
  { label: "∛", value: "cbrt(", className: "fn" },

  { label: "xʸ", value: "**", className: "fn" },
  { label: "x²", value: "**2", className: "fn" },
  { label: "x³", value: "**3", className: "fn" },
  { label: "1/x", value: "reciprocal(", className: "fn" },
  { label: "n!", value: "!", className: "fn" },

  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "×", value: "*", className: "op" },
  { label: "π", value: "pi", className: "const" },

  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "−", value: "-", className: "op" },
  { label: "e", value: "e", className: "const" },

  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "+", value: "+", className: "op" },
  { label: "%", value: "/100", className: "fn" },

  { label: "0", value: "0" },
  { label: ".", value: "." },
  { label: "±", value: "negate", className: "fn" },
  { label: "mod", value: "%", className: "op" },
  { label: "=", value: "=", className: "eq" },
];

/** Constants / extra functions page */
const CONST_BUTTONS: ButtonDef[] = [
  { label: "C", value: "clear", className: "fn danger" },
  { label: "⌫", value: "backspace", className: "fn" },
  { label: "(", value: "(", className: "fn" },
  { label: ")", value: ")", className: "fn" },
  { label: "=", value: "=", className: "eq" },

  { label: "π", value: "pi", className: "const" },
  { label: "e", value: "e", className: "const" },
  { label: "τ", value: "tau", className: "const" },
  { label: "φ", value: "phi", className: "const" },
  { label: "°→rad", value: "deg2rad(", className: "fn" },

  { label: "floor", value: "floor(", className: "fn" },
  { label: "ceil", value: "ceil(", className: "fn" },
  { label: "round", value: "round(", className: "fn" },
  { label: "abs", value: "abs(", className: "fn" },
  { label: "rad→°", value: "rad2deg(", className: "fn" },

  { label: "gcd", value: "gcd(", className: "fn" },
  { label: "lcm", value: "lcm(", className: "fn" },
  { label: "nCr", value: "nCr(", className: "fn" },
  { label: "nPr", value: "nPr(", className: "fn" },
  { label: "fib", value: "fib(", className: "fn" },

  { label: "exp", value: "exp(", className: "fn" },
  { label: "hyp", value: "hypot(", className: "fn" },
  { label: "mean", value: "mean(", className: "fn" },
  { label: "std", value: "stdev(", className: "fn" },
  { label: "prime?", value: "is_prime(", className: "fn" },

  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "×", value: "*", className: "op" },
  { label: "÷", value: "/", className: "op" },

  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "+", value: "+", className: "op" },
  { label: "−", value: "-", className: "op" },

  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "0", value: "0" },
  { label: ".", value: "." },
];

const OPERATORS = new Set(["+", "-", "*", "/", "**", "%"]);

export class Calculator {
  private display: Display;
  private bridge: PythonBridge;
  private keypad: HTMLElement;
  private waitingForNew = false;
  private lastResult: string | null = null;
  private mode: "basic" | "sci" | "const" = "sci";

  constructor(bridge: PythonBridge) {
    this.bridge = bridge;
    this.display = new Display("display-expression", "display-result");
    const kp = document.getElementById("keypad");
    if (!kp) throw new Error("Keypad element not found");
    this.keypad = kp;
    this.buildKeypad();
    this.attachModeButtons();
    attachKeyboard((key) => this.handleInput(key));
  }

  private attachModeButtons(): void {
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = (btn as HTMLElement).dataset.mode as "basic" | "sci" | "const";
        this.mode = mode;
        document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.buildKeypad();
      });
    });
  }

  private currentButtons(): ButtonDef[] {
    if (this.mode === "basic") return BASIC_BUTTONS;
    if (this.mode === "const") return CONST_BUTTONS;
    return SCI_BUTTONS;
  }

  private buildKeypad(): void {
    this.keypad.innerHTML = "";
    this.keypad.className = "keypad" + (this.mode === "basic" ? " basic" : "");
    for (const btn of this.currentButtons()) {
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
        this.lastResult = null;
        break;

      case "backspace":
        if (this.waitingForNew) {
          this.display.clear();
          this.waitingForNew = false;
          this.lastResult = null;
        } else {
          this.display.backspace();
        }
        break;

      case "negate": {
        const expr = this.display.getExpression();
        if (!expr || this.waitingForNew) {
          if (this.lastResult) {
            this.display.setExpression(`negate(${this.lastResult})`);
            this.waitingForNew = false;
          }
        } else {
          this.display.setExpression(`negate(${expr})`);
        }
        break;
      }

      case "=":
        void this.evaluate();
        break;

      case "!": {
        // Append factorial postfix
        if (this.waitingForNew && this.lastResult) {
          this.display.setExpression(this.lastResult + "!");
          this.waitingForNew = false;
        } else {
          const expr = this.display.getExpression();
          if (expr) this.display.append("!");
        }
        break;
      }

      default:
        if (this.waitingForNew) {
          if (OPERATORS.has(value) || value === "**2" || value === "**3" || value === "/100") {
            // chain from last result
            this.display.setExpression((this.lastResult ?? "0") + value);
          } else if (value.endsWith("(") || value === "pi" || value === "e" || value === "tau" || value === "phi") {
            this.display.setExpression(value);
          } else {
            this.display.setExpression(value);
          }
          this.waitingForNew = false;
        } else {
          this.display.append(value);
        }
        break;
    }
  }

  private async evaluate(): Promise<void> {
    let expr = this.display.getExpression().trim();
    if (!expr) return;

    // cosmetic: replace display operators already stored as * / **
    const response = await this.bridge.evaluate(expr);
    if (response.ok && response.result != null) {
      this.display.setResult(response.result, false);
      this.lastResult = response.result;
      this.waitingForNew = true;
    } else {
      this.display.setResult(response.error ?? "Error", true);
      this.waitingForNew = true;
    }
  }
}
