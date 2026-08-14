$('#start-btn').click(function() {
    initGame();
});

function initGame() {
    let diff = $('#difficulty').val();
    let rCount = parseInt($('#robot-count').val());

    if (diff === 'easy') moveSpeed = 0.04;
    else if (diff === 'medium') { moveSpeed = 0.06; rCount = 3; }
    else if (diff === 'hard') { moveSpeed = 0.09; rCount = 5; }

    $('.ui-layer').hide();
    $('#gameCanvas, #stats-overlay, #controller-area').css('display', 'grid');

    const s = Math.min(window.innerWidth, window.innerHeight * 0.5);
    canvas.width = Math.floor(s / GRID_SIZE) * GRID_SIZE;
    canvas.height = canvas.width;
    tileCount = canvas.width / GRID_SIZE;

    player = new Snake(2, 2, '#4a90e2');
    robots = [];
    for(let i=0; i<rCount; i++) {
        robots.push(new Snake(tileCount-3, Math.floor(Math.random()*tileCount), '#e74c3c', true));
    }
    
    foods = [];
    for(let i=0; i<15; i++) foods.push({ x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) });

    gameRunning = true;
    loop();
}

$('#up-btn').on('pointerdown', () => setDir(0, -1));
$('#down-btn').on('pointerdown', () => setDir(0, 1));
$('#left-btn').on('pointerdown', () => setDir(-1, 0));
$('#right-btn').on('pointerdown', () => setDir(1, 0));