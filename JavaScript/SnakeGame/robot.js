Snake.prototype.aiThink = function() {
    let target = foods[0];
    if (!target) return;
    if (target.x > this.targetX && this.dir.x !== -1) this.nextDir = {x: 1, y: 0};
    else if (target.x < this.targetX && this.dir.x !== 1) this.nextDir = {x: -1, y: 0};
    else if (target.y > this.targetY && this.dir.y !== -1) this.nextDir = {x: 0, y: 1};
    else if (target.y < this.targetY && this.dir.y !== 1) this.nextDir = {x: 0, y: -1};
};

function killRobot(s) {
    s.dead = true;
    s.body.forEach(p => { foods.push({x:p.x, y:p.y}); });
}