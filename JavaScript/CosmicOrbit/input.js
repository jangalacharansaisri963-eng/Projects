const Input = {
    leverValue: 0, // -1 (Left) to 1 (Right)
    isThrusting: false,
    
    init() {
        const handle = document.getElementById('swing-handle');
        const track = document.getElementById('swing-track');
        const thrust = document.getElementById('thrust-pad');

        const updateLever = (clientX) => {
            const rect = track.getBoundingClientRect();
            let x = (clientX - rect.left) / rect.width; // 0 to 1
            x = Math.max(0, Math.min(1, x));
            this.leverValue = (x - 0.5) * 2; // Map to -1 to 1
            handle.style.left = (x * rect.width - 20) + 'px';
        };

        track.addEventListener('pointermove', (e) => {
            if (e.buttons > 0) updateLever(e.clientX);
        });
        
        thrust.addEventListener('pointerdown', () => this.isThrusting = true);
        window.addEventListener('pointerup', () => this.isThrusting = false);
        
        // Keyboard Support
        window.addEventListener('keydown', (e) => {
            if(e.code === 'ArrowLeft') this.leverValue = -1;
            if(e.code === 'ArrowRight') this.leverValue = 1;
            if(e.code === 'Space') this.isThrusting = true;
        });
    }
};