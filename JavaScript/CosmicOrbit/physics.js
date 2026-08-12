const Vec = {
    create: (x, y) => ({x, y}),
    add: (v1, v2) => ({x: v1.x + v2.x, y: v1.y + v2.y}),
    sub: (v1, v2) => ({x: v1.x - v2.x, y: v1.y - v2.y}),
    mult: (v, n) => ({x: v.x * n, y: v.y * n}),
    mag: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
    normalize: (v) => {
        const m = Math.sqrt(v.x * v.x + v.y * v.y);
        return m === 0 ? {x:0, y:0} : {x: v.x/m, y: v.y/m};
    },
    dist: (v1, v2) => Math.sqrt((v1.x-v2.x)**2 + (v1.y-v2.y)**2)
};