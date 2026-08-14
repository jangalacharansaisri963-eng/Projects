function setDir(x, y) {
    if (!gameRunning) return;
    if (x !== 0 && player.dir.x === 0) player.nextDir = {x, y: 0};
    if (y !== 0 && player.dir.y === 0) player.nextDir = {x: 0, y};
}

window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'arrowup' || k === 'w') setDir(0, -1);
    if (k === 'arrowdown' || k === 's') setDir(0, 1);
    if (k === 'arrowleft' || k === 'a') setDir(-1, 0);
    if (k === 'arrowright' || k === 'd') setDir(1, 0);
});

let tsX, tsY;
const pad = document.getElementById('swipe-pad');
pad.addEventListener('touchstart', e => { 
    tsX = e.touches[0].clientX; 
    tsY = e.touches[0].clientY; 
});
pad.addEventListener('touchend', e => {
    let dx = e.changedTouches[0].clientX - tsX;
    let dy = e.changedTouches[0].clientY - tsY;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
        else setDir(0, dy > 0 ? 1 : -1);
    }
});