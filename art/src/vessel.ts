import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

const canvas = document.getElementById('vessel-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let width = window.innerWidth;
let height = window.innerHeight - 80;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight - 80;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resize);
resize();

const text = "We are building the future of the open web, piece by piece, interface by interface. Software is not just a tool; it is a medium for thought, a vessel for optimism, and a canvas for human connection. The constraints of the past are melting away, giving us the freedom to create fluid, expressive, and deeply personal digital worlds. We shape our tools, and thereafter our tools shape us, growing together in a shared drift of meaning and memory. What we create today becomes the foundation for tomorrow's imagination. Step by step, frame by frame, we are becoming. ";
const repeatedText = text.repeat(30);

const fontSize = 16;
const fontString = `${fontSize}px system-ui, -apple-system, sans-serif`;

const prepared = prepareWithSegments(repeatedText, fontString);

let mouseX = width / 2;
let mouseY = height / 2;
let targetMouseX = mouseX;
let targetMouseY = mouseY;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = e.clientX - rect.left;
    targetMouseY = e.clientY - rect.top;
});
canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = e.touches[0].clientX - rect.left;
        targetMouseY = e.touches[0].clientY - rect.top;
    }
}, {passive: true});

function getBounds(y: number, time: number): [number, number] {
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.35;
    const dy = y - cy;
    
    if (Math.abs(dy) > R * 1.5) return [0, 0];

    const dxMouse = targetMouseX - cx;
    
    const wobbleWidth = Math.sin(y * 0.02 + time * 0.002) * 15 + Math.cos(y * 0.05 - time * 0.003) * 10;
    const wobbleCenter = Math.cos(y * 0.01 + time * 0.001) * 20;
    
    let pullOffsetX = 0;
    let pullOffsetW = 0;
    
    const yDistToMouse = Math.abs(y - targetMouseY);
    if (yDistToMouse < R) {
        const falloff = Math.cos((yDistToMouse / R) * (Math.PI / 2));
        const pullStrength = Math.pow(falloff, 2);
        
        const dxFromSlice = targetMouseX - cx;
        pullOffsetX = dxFromSlice * 0.35 * pullStrength;
        pullOffsetW = Math.sin(time * 0.005) * 20 * pullStrength;
    }

    const rSq = R*R - dy*dy;
    if (rSq <= 0) return [0, 0];
    
    let halfWidth = Math.sqrt(rSq);
    
    let startX = cx - halfWidth + wobbleCenter + pullOffsetX;
    let lineWidth = halfWidth * 2 + wobbleWidth + pullOffsetW;
    
    return [startX, Math.max(0, lineWidth)];
}

function draw(timestamp: number) {
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    ctx.clearRect(0, 0, width, height);
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                   (!document.documentElement.getAttribute('data-theme') === 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)";
    ctx.font = fontString;
    ctx.textBaseline = "alphabetic";

    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    const R = Math.min(width, height) * 0.35;
    const cy = height / 2;
    
    const startY = cy - R - 100;
    const endY = cy + R + 100;
    const lineHeight = fontSize * 1.5;

    for (let y = startY; y < endY; y += lineHeight) {
        const [startX, lineWidth] = getBounds(y, timestamp);
        
        if (lineWidth > 30) {
            const line = layoutNextLine(prepared, cursor, lineWidth);
            if (line === null) break;
            
            ctx.fillText(line.text, startX, y + lineHeight * 0.8);
            cursor = line.end;
        }
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
