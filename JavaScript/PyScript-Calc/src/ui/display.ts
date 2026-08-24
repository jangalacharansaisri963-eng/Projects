/**
 * Display management for the calculator.
 */

export class Display {
  private expressionEl: HTMLElement;
  private resultEl: HTMLElement;
  private currentExpression = "";
  private currentResult = "0";
  private isError = false;

  constructor(expressionId: string, resultId: string) {
    const expr = document.getElementById(expressionId);
    const res = document.getElementById(resultId);
    if (!expr || !res) {
      throw new Error("Display elements not found");
    }
    this.expressionEl = expr;
    this.resultEl = res;
  }

  setExpression(text: string): void {
    this.currentExpression = text;
    this.expressionEl.textContent = text;
  }

  getExpression(): string {
    return this.currentExpression;
  }

  setResult(text: string, isError = false): void {
    this.currentResult = text;
    this.isError = isError;
    this.resultEl.textContent = text;
    this.resultEl.classList.toggle("error", isError);
  }

  getResult(): string {
    return this.currentResult;
  }

  clear(): void {
    this.setExpression("");
    this.setResult("0");
  }

  appendToExpression(token: string): void {
    this.currentExpression += token;
    this.expressionEl.textContent = this.currentExpression;
  }

  backspace(): void {
    if (this.isError) {
      this.clear();
      return;
    }
    this.currentExpression = this.currentExpression.slice(0, -1);
    this.expressionEl.textContent = this.currentExpression;
    if (!this.currentExpression) {
      this.setResult("0");
    }
  }
}
