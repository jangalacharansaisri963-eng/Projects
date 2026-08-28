/**
 * Application entry point.
 * Sets up the Python ↔ TypeScript bridge, tabs, unit converter UI, and calculator.
 */

import "./style.css";
import { Calculator, type PythonBridge } from "./ui/calculator";

// ---------------------------------------------------------------------------
// Pyodide / PyScript bridge
// ---------------------------------------------------------------------------

declare global {
  interface Window {
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
      const result = window.pyEvaluate(expression);
      return result;
    } catch (err) {
      return { ok: false, result: null, error: String(err) };
    }
  }
}

const bridge = new PyBridge();

// ---------------------------------------------------------------------------
// Tab navigation
// ---------------------------------------------------------------------------

function setupTabs(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");
  const panels: Record<string, HTMLElement | null> = {
    calc: document.getElementById("panel-calc"),
    units: document.getElementById("panel-units"),
    terminal: document.getElementById("panel-terminal"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab ?? "calc";
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      Object.entries(panels).forEach(([key, el]) => {
        if (!el) return;
        el.classList.toggle("active", key === name);
      });
      if (name === "terminal") {
        setTimeout(() => document.getElementById("terminal-input")?.focus(), 50);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Terminal UI
// ---------------------------------------------------------------------------

class Terminal {
  private output: HTMLElement;
  private input: HTMLInputElement;
  private history: string[] = [];
  private historyIndex = -1;
  private bridge: PyBridge;

  constructor(bridge: PyBridge) {
    this.bridge = bridge;
    this.output = document.getElementById("terminal-output")!;
    this.input = document.getElementById("terminal-input") as HTMLInputElement;

    document.getElementById("btn-term-clear")!.addEventListener("click", () => this.clearOutput());
    this.input.addEventListener("keydown", (e) => this.onKeyDown(e));

    // Welcome message
    this.appendLine("PyCalc Terminal — pure Python engine", "out");
    this.appendLine("Type help() or functions()  ·  Factorial: 5!  ·  Units: convert(1,'m','ft')", "out");
    this.appendLine("", "out");
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
      // multi-line results (help / functions)
      const lines = String(response.result).split("\n");
      for (const line of lines) {
        this.appendLine(line, "out");
      }
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
// Unit Converter UI (logic lives in Python convert())
// ---------------------------------------------------------------------------

class UnitConverter {
  private bridge: PyBridge;
  private categorySel: HTMLSelectElement;
  private fromSel: HTMLSelectElement;
  private toSel: HTMLSelectElement;
  private valueInput: HTMLInputElement;
  private resultEl: HTMLElement;
  private errorEl: HTMLElement;
  private allUnits: string[] = [];
  private categories: string[] = [];

  constructor(bridge: PyBridge) {
    this.bridge = bridge;
    this.categorySel = document.getElementById("unit-category") as HTMLSelectElement;
    this.fromSel = document.getElementById("unit-from") as HTMLSelectElement;
    this.toSel = document.getElementById("unit-to") as HTMLSelectElement;
    this.valueInput = document.getElementById("unit-value") as HTMLInputElement;
    this.resultEl = document.getElementById("unit-result")!;
    this.errorEl = document.getElementById("unit-error")!;

    document.getElementById("unit-convert")!.addEventListener("click", () => void this.convert());
    document.getElementById("unit-swap")!.addEventListener("click", () => this.swap());
    this.categorySel.addEventListener("change", () => void this.onCategoryChange());
    this.valueInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") void this.convert();
    });
  }

  async init(): Promise<void> {
    if (!this.bridge.isReady()) return;

    // Load categories
    const catRes = await this.bridge.evaluate("list_categories()");
    if (catRes.ok && catRes.result) {
      try {
        // result is a string repr of list
        const raw = catRes.result.replace(/'/g, '"');
        this.categories = JSON.parse(raw);
      } catch {
        this.categories = catRes.result
          .replace(/[\[\]']/g, "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      this.categorySel.innerHTML = '<option value="">All categories</option>';
      for (const c of this.categories) {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        this.categorySel.appendChild(opt);
      }
    }

    // Load all units
    const uRes = await this.bridge.evaluate("list_units()");
    if (uRes.ok && uRes.result) {
      this.allUnits = this.parseList(uRes.result);
      this.populateSelects(this.allUnits);
    }

    // sensible defaults
    this.selectOption(this.fromSel, "m");
    this.selectOption(this.toSel, "ft");
  }

  private parseList(s: string): string[] {
    try {
      return JSON.parse(s.replace(/'/g, '"'));
    } catch {
      return s
        .replace(/[\[\]']/g, "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }

  private populateSelects(units: string[]): void {
    const fill = (sel: HTMLSelectElement) => {
      const prev = sel.value;
      sel.innerHTML = "";
      for (const u of units) {
        const opt = document.createElement("option");
        opt.value = u;
        opt.textContent = u;
        sel.appendChild(opt);
      }
      if (prev && units.includes(prev)) sel.value = prev;
    };
    fill(this.fromSel);
    fill(this.toSel);
  }

  private selectOption(sel: HTMLSelectElement, value: string): void {
    if ([...sel.options].some((o) => o.value === value)) {
      sel.value = value;
    }
  }

  private async onCategoryChange(): Promise<void> {
    const cat = this.categorySel.value;
    if (!cat) {
      this.populateSelects(this.allUnits);
      return;
    }
    const res = await this.bridge.evaluate(`list_units("${cat}")`);
    if (res.ok && res.result) {
      const units = this.parseList(res.result);
      this.populateSelects(units);
    }
  }

  private swap(): void {
    const a = this.fromSel.value;
    const b = this.toSel.value;
    this.fromSel.value = b;
    this.toSel.value = a;
    void this.convert();
  }

  private async convert(): Promise<void> {
    this.errorEl.classList.add("hidden");
    const val = this.valueInput.value.trim() || "0";
    const from = this.fromSel.value;
    const to = this.toSel.value;
    if (!from || !to) {
      this.showError("Select units");
      return;
    }
    // Build a pure-Python call
    const expr = `convert(${val}, "${from}", "${to}")`;
    const res = await this.bridge.evaluate(expr);
    if (res.ok && res.result != null) {
      this.resultEl.textContent = res.result;
    } else {
      this.resultEl.textContent = "—";
      this.showError(res.error ?? "Conversion failed");
    }
  }

  private showError(msg: string): void {
    this.errorEl.textContent = msg;
    this.errorEl.classList.remove("hidden");
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

async function waitForPython(maxMs = 45000): Promise<boolean> {
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
  setupTabs();
  new Terminal(bridge);

  const ok = await waitForPython();
  if (ok) {
    bridge.markReady();
    new Calculator(bridge);
    const units = new UnitConverter(bridge);
    await units.init();
    hideLoading();
  } else {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.innerHTML = "<p style='color:#ef5350'>Failed to load Python engine.</p>";
    }
  }
}

main();
