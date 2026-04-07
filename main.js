const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"


game.width = 800;
game.height = 800;

ctx = game.getContext("2d")
console.log(ctx);

function clearScreen() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function setPoint({ x, y }) {
    const size = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x, y, size, size)
}


function ndcToPixel(point) {
    
    point.x = (point.x + 1) / 2 * game.width;
    point.y = (1 - (point.y + 1) / 2) * game.height;
}


function project(point, { x, y, z }) {
    point.x = x / z;
    point.y = y / z;
}


function rotate_xz({ x, y, z }, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x * c - z * s,
        y,
        z: x * s + z * c,
    };
}

function drawline(a, b) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}


function show3D({ x, y, z }) {
    const point = { x: 0, y: 0.0 }
    out = rotate_xz({ x: x, y: y, z: z }, angle)
    project(point, { x: out.x, y: out.y, z: out.z + 1 })
    ndcToPixel(point)
    
    return { x: point.x, y: point.y }
}

const vertices = [
    { x: 0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: 0.25 },

    { x: 0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x: 0.25, y: -0.25, z: -0.25 },
]

const faces = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

let z = 1
let FPS = 60
let angle = 0.0

function update() {
    clearScreen();
    z += 1 / FPS;
    angle += 1 / FPS;

    for (const vertex of vertices) {

        show3D({ x: vertex.x, y: vertex.y, z: vertex.z });
    }

    
    for (const face of faces) {
        for (let i = 0; i < face.length; i++) {
            const a = vertices[face[i]];
            const b = vertices[face[(i + 1) % face.length]];

            outP1 = show3D({ x: a.x, y: a.y, z: a.z });
            outP2 = show3D({ x: b.x, y: b.y, z: b.z });

            drawline(outP1, outP2);
            console.log(a);
            console.log(b);
        }
    }
    

    requestAnimationFrame(update)
}

update();