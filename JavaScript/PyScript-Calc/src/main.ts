/**
 * Application entry point.
 * Sets up the Python ↔ TypeScript bridge and initializes UI.
 */

import "./style.css";
import { Calculator, type PythonBridge } from "./ui/calculator";

// ---------------------------------------------------------------------------
// Pyodide / PyScript bridge
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    // Exposed by our Python main.py once loaded
    pyEvaluate?: (expr: string) => { ok: boolean; result: string | null; error: string | null };
    pyReady?: boolean;
  }
}

class PyBridge implements PythonBridge {
  private ready = false;

  isReady(): boolean {
    return this.ready && typeof window.pyEvaluate === "function";
  }

  markReady(): void {
    this.ready = true;
  }

  async evaluate(expression: string): Promise<{
    ok: boolean;
    result: string | null;
    error: string | null;
  }> {
    if (!this.isReady() || !window.pyEvaluate) {
      return { ok: false, result: null, error: "Python engine not ready" };
    }
    try {
      // pyEvaluate is a synchronous proxy from Pyodide when using py-script
      const result = window.pyEvaluate(expression);
      return result;
    } catch (err) {
      return { ok: false, result: null, error: String(err) };
    }
  }
}

const bridge = new PyBridge();

// ---------------------------------------------------------------------------
// Terminal UI
// ---------------------------------------------------------------------------

class Terminal {
  private overlay: HTMLElement;
  private output: HTMLElement;
  private input: HTMLInputElement;
  private history: string[] = [];
  private historyIndex = -1;
  private bridge: PyBridge;

  constructor(bridge: PyBridge) {
    this.bridge = bridge;
    this.overlay = document.getElementById("terminal-overlay")!;
    this.output = document.getElementById("terminal-output")!;
    this.input = document.getElementById("terminal-input") as HTMLInputElement;

    document.getElementById("btn-terminal")!.addEventListener("click", () => this.open());
    document.getElementById("btn-term-close")!.addEventListener("click", () => this.close());
    document.getElementById("btn-term-clear")!.addEventListener("click", () => this.clearOutput());

    this.input.addEventListener("keydown", (e) => this.onKeyDown(e));
  }

  open(): void {
    this.overlay.classList.remove("hidden");
    this.overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => this.input.focus(), 50);
  }

  close(): void {
    this.overlay.classList.add("hidden");
    this.overlay.setAttribute("aria-hidden", "true");
  }

  clearOutput(): void {
    this.output.innerHTML = "";
  }

  private appendLine(text: string, cls: string): void {
    const span = document.createElement("div");
    span.className = cls;
    span.textContent = text;
    this.output.appendChild(span);
    this.output.scrollTop = this.output.scrollHeight;
  }

  private async run(command: string): Promise<void> {
    const trimmed = command.trim();
    if (!trimmed) return;

    this.appendLine(`>>> ${trimmed}`, "cmd");

    if (trimmed === "clear()" || trimmed === "clear") {
      this.clearOutput();
      return;
    }

    if (!this.bridge.isReady()) {
      this.appendLine("Python engine not ready", "err");
      return;
    }

    const response = await this.bridge.evaluate(trimmed);
    if (response.ok && response.result != null) {
      this.appendLine(response.result, "out");
    } else {
      this.appendLine(response.error ?? "Error", "err");
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = this.input.value;
      this.input.value = "";
      if (cmd.trim()) {
        this.history.push(cmd);
        this.historyIndex = this.history.length;
      }
      void this.run(cmd);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.history.length === 0) return;
      this.historyIndex = Math.max(0, this.historyIndex - 1);
      this.input.value = this.history[this.historyIndex] ?? "";
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex] ?? "";
      } else {
        this.historyIndex = this.history.length;
        this.input.value = "";
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function hideLoading(): void {
  const el = document.getElementById("loading");
  if (el) {
    el.classList.add("hidden");
    setTimeout(() => el.remove(), 400);
  }
}

async function waitForPython(maxMs = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (typeof window.pyEvaluate === "function") {
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

async function main(): Promise<void> {
  new Terminal(bridge);

  const ok = await waitForPython();
  if (ok) {
    bridge.markReady();
    new Calculator(bridge);
    hideLoading();
  } else {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.innerHTML = "<p style='color:#ef5350'>Failed to load Python engine.</p>";
    }
  }
}

main();
