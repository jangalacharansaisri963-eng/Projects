class InputHandler {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        this.joy = { x: 0, y: 0, active: false, startX: 0, startY: 0 };
        this.init();
    }

    init() {
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
        window.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
        window.addEventListener('mousedown', () => this.mouse.pressed = true);
        window.addEventListener('mouseup', () => this.mouse.pressed = false);

        const knob = document.getElementById('joystick-knob');
        window.addEventListener('touchstart', e => {
            for (let t of e.changedTouches) {
                if (t.clientX < window.innerWidth / 2) {
                    this.joy.active = true;
                    this.joy.startX = t.clientX;
                    this.joy.startY = t.clientY;
                }
            }
        });

        window.addEventListener('touchmove', e => {
            if (!this.joy.active) return;
            for (let t of e.touches) {
                if (t.clientX < window.innerWidth / 2) {
                    const dx = t.clientX - this.joy.startX;
                    const dy = t.clientY - this.joy.startY;
                    const dist = Math.min(Math.hypot(dx, dy), 50);
                    const angle = Math.atan2(dy, dx);
                    this.joy.x = (Math.cos(angle) * dist) / 50;
                    this.joy.y = (Math.sin(angle) * dist) / 50;
                    knob.style.transform = `translate(${this.joy.x * 35}px, ${this.joy.y * 35}px)`;
                }
            }
        }, { passive: false });

        window.addEventListener('touchend', () => {
            this.joy.active = false;
            this.joy.x = 0; this.joy.y = 0;
            knob.style.transform = `translate(0,0)`;
        });
    }
}