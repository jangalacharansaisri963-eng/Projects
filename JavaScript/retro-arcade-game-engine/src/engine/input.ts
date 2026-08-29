/**
 * Unified Input Manager supporting Keyboard, Mouse/Touch Screen, Virtual Gamepad & Gamepad API
 */

import { VirtualInputState } from './types';

export class InputManager {
  state: VirtualInputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    buttonA: false,
    buttonB: false,
    buttonX: false,
    buttonY: false,
    start: false,
    select: false,
    analogX: 0,
    analogY: 0,
    pointerActive: false,
    pointerX: 0,
    pointerY: 0,
    pointerDown: false,
  };

  private keysDown: Set<string> = new Set();
  private prevButtonA = false;
  private prevButtonB = false;
  private prevStart = false;

  // Track button just pressed
  justPressedA = false;
  justPressedB = false;
  justPressedStart = false;

  // Custom keybindings
  keyMap: Record<string, string[]> = {
    up: ['ArrowUp', 'KeyW', 'KeyI'],
    down: ['ArrowDown', 'KeyS', 'KeyK'],
    left: ['ArrowLeft', 'KeyA', 'KeyJ'],
    right: ['ArrowRight', 'KeyD', 'KeyL'],
    buttonA: ['Space', 'KeyZ', 'Enter'],
    buttonB: ['KeyX', 'ShiftLeft', 'ShiftRight'],
    buttonX: ['KeyC', 'KeyE'],
    buttonY: ['KeyV', 'KeyQ'],
    start: ['KeyP', 'Escape'],
    select: ['Tab', 'Digit1', 'Digit2', 'Digit3', 'Digit4'],
  };

  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    window.addEventListener('keydown', (e) => {
      // Prevent scrolling when pressing arrow keys or space in game
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      this.keysDown.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });

    // Reset when tab loses focus
    window.addEventListener('blur', () => {
      this.keysDown.clear();
      this.resetVirtual();
    });
  }

  setVirtualInput(key: keyof VirtualInputState, value: any) {
    (this.state as any)[key] = value;
  }

  setVirtualAnalog(x: number, y: number) {
    this.state.analogX = Math.max(-1, Math.min(1, x));
    this.state.analogY = Math.max(-1, Math.min(1, y));

    this.state.left = this.state.left || this.state.analogX < -0.3;
    this.state.right = this.state.right || this.state.analogX > 0.3;
    this.state.up = this.state.up || this.state.analogY < -0.3;
    this.state.down = this.state.down || this.state.analogY > 0.3;
  }

  resetVirtual() {
    this.state.up = false;
    this.state.down = false;
    this.state.left = false;
    this.state.right = false;
    this.state.buttonA = false;
    this.state.buttonB = false;
    this.state.buttonX = false;
    this.state.buttonY = false;
    this.state.start = false;
    this.state.select = false;
    this.state.analogX = 0;
    this.state.analogY = 0;
    this.state.pointerDown = false;
  }

  update() {
    // 1. Process Keyboard inputs
    const kbUp = this.keyMap.up.some((k) => this.keysDown.has(k));
    const kbDown = this.keyMap.down.some((k) => this.keysDown.has(k));
    const kbLeft = this.keyMap.left.some((k) => this.keysDown.has(k));
    const kbRight = this.keyMap.right.some((k) => this.keysDown.has(k));
    const kbA = this.keyMap.buttonA.some((k) => this.keysDown.has(k));
    const kbB = this.keyMap.buttonB.some((k) => this.keysDown.has(k));
    const kbX = this.keyMap.buttonX.some((k) => this.keysDown.has(k));
    const kbY = this.keyMap.buttonY.some((k) => this.keysDown.has(k));
    const kbStart = this.keyMap.start.some((k) => this.keysDown.has(k));
    const kbSelect = this.keyMap.select.some((k) => this.keysDown.has(k));

    // 2. Poll Gamepad API if available
    let gpUp = false, gpDown = false, gpLeft = false, gpRight = false;
    let gpA = false, gpB = false, gpX = false, gpY = false, gpStart = false, gpSelect = false;
    let gpStickX = 0, gpStickY = 0;

    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      if (gamepads && gamepads[0]) {
        const gp = gamepads[0];
        gpA = gp.buttons[0]?.pressed || false;
        gpB = gp.buttons[1]?.pressed || false;
        gpX = gp.buttons[2]?.pressed || false;
        gpY = gp.buttons[3]?.pressed || false;
        gpStart = gp.buttons[9]?.pressed || false;
        gpSelect = gp.buttons[8]?.pressed || false;

        gpUp = gp.buttons[12]?.pressed || false;
        gpDown = gp.buttons[13]?.pressed || false;
        gpLeft = gp.buttons[14]?.pressed || false;
        gpRight = gp.buttons[15]?.pressed || false;

        const deadzone = 0.25;
        const ax = gp.axes[0] || 0;
        const ay = gp.axes[1] || 0;
        if (Math.abs(ax) > deadzone) gpStickX = ax;
        if (Math.abs(ay) > deadzone) gpStickY = ay;

        if (gpStickX < -deadzone) gpLeft = true;
        if (gpStickX > deadzone) gpRight = true;
        if (gpStickY < -deadzone) gpUp = true;
        if (gpStickY > deadzone) gpDown = true;
      }
    }

    // Combine virtual touch state with keyboard and gamepad
    this.state.up = kbUp || gpUp || this.state.up;
    this.state.down = kbDown || gpDown || this.state.down;
    this.state.left = kbLeft || gpLeft || this.state.left;
    this.state.right = kbRight || gpRight || this.state.right;
    this.state.buttonA = kbA || gpA || this.state.buttonA;
    this.state.buttonB = kbB || gpB || this.state.buttonB;
    this.state.buttonX = kbX || gpX || this.state.buttonX;
    this.state.buttonY = kbY || gpY || this.state.buttonY;
    this.state.start = kbStart || gpStart || this.state.start;
    this.state.select = kbSelect || gpSelect || this.state.select;

    // Analog stick calculation
    let finalAnalogX = this.state.analogX || gpStickX;
    let finalAnalogY = this.state.analogY || gpStickY;
    if (this.state.left) finalAnalogX = -1;
    if (this.state.right) finalAnalogX = 1;
    if (this.state.up) finalAnalogY = -1;
    if (this.state.down) finalAnalogY = 1;
    this.state.analogX = finalAnalogX;
    this.state.analogY = finalAnalogY;

    // Just pressed triggers
    this.justPressedA = this.state.buttonA && !this.prevButtonA;
    this.justPressedB = this.state.buttonB && !this.prevButtonB;
    this.justPressedStart = this.state.start && !this.prevStart;

    this.prevButtonA = this.state.buttonA;
    this.prevButtonB = this.state.buttonB;
    this.prevStart = this.state.start;
  }

  vibrate(ms = 30) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Ignore mobile browser restriction
      }
    }
  }
}

export const input = new InputManager();
