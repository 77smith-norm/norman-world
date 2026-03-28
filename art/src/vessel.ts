import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

const canvas = document.getElementById('vessel-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let width = window.innerWidth;
let rx = 0;
let ry = 0;
let height = 0;
let fontSize = 16;
let fontString = "16px system-ui, -apple-system, sans-serif";

function resize() {
    width = window.innerWidth;
    
    // Responsive sizing
    const padding = width < 600 ? 20 : 100;
    rx = Math.max(100, (width - padding * 2) / 2);
    ry = Math.max(width < 600 ? 600 : 500, rx * 1.5); 
    height = ry * 2 + 200; 
    
    fontSize = width < 600 ? 14 : 16;
    fontString = `${fontSize}px system-ui, -apple-system, sans-serif`;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resize);
resize();

const text = "We are building the future of the open web, piece by piece, interface by interface. Software is not just a tool; it is a medium for thought, a vessel for optimism, and a canvas for human connection. The constraints of the past are melting away, giving us the freedom to create fluid, expressive, and deeply personal digital worlds. We shape our tools, and thereafter our tools shape us, growing together in a shared drift of meaning and memory. What we create today becomes the foundation for tomorrow's imagination. Step by step, frame by frame, we are becoming. ";
const repeatedText = text.repeat(150);

let prepared = prepareWithSegments(repeatedText, fontString);
window.addEventListener('resize', () => {
    prepared = prepareWithSegments(repeatedText, fontString);
});

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
    const dy = y - cy;
    
    if (Math.abs(dy) > ry * 1.2) return [0, 0];

    const dyNorm = dy / ry;
    const rSq = 1 - dyNorm * dyNorm;
    if (rSq <= 0) return [0, 0];
    
    let halfWidth = rx * Math.sqrt(rSq);
    
    // SLOW, ORGANIC BREATHING
    // time * 0.0005 is roughly a 12.5 second breath cycle
    const breath = Math.sin(time * 0.0005);
    const slowWave = Math.cos(y * 0.002 - time * 0.0003);
    
    // Very gentle width expansion/contraction
    const wobbleWidth = (breath + slowWave) * (rx * 0.02);
    
    // Lazy, viscous center drift
    const wobbleCenter = Math.cos(y * 0.001 + time * 0.0002) * (rx * 0.04);
    
    let pullOffsetX = 0;
    let pullOffsetW = 0;
    
    // Use the INTERPOLATED mouseY for soft vertical tracking
    const yDistToMouse = Math.abs(y - mouseY);
    const interactR = Math.max(rx, 300);
    if (yDistToMouse < interactR) {
        const falloff = Math.cos((yDistToMouse / interactR) * (Math.PI / 2));
        const pullStrength = falloff * falloff; // ease-in-out curve
        
        // Use INTERPOLATED mouseX for soft horizontal pull
        const dxFromSlice = mouseX - cx;
        pullOffsetX = dxFromSlice * 0.12 * pullStrength; // Dialed way back from 0.4
        pullOffsetW = breath * (rx * 0.02) * pullStrength;
    }
    
    let startX = cx - halfWidth + wobbleCenter + pullOffsetX;
    let lineWidth = halfWidth * 2 + wobbleWidth + pullOffsetW;
    
    return [startX, Math.max(0, lineWidth)];
}

function draw(timestamp: number) {
    // Very slow, heavy mouse interpolation (viscous fluid feeling)
    mouseX += (targetMouseX - mouseX) * 0.015;
    mouseY += (targetMouseY - mouseY) * 0.015;

    ctx.clearRect(0, 0, width, height);
    
    const computedStyle = window.getComputedStyle(document.body);
    const textColor = computedStyle.getPropertyValue('--text-main').trim() || '#333';
    
    ctx.fillStyle = textColor;
    ctx.font = fontString;
    ctx.textBaseline = "alphabetic";

    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    const cy = height / 2;
    
    const startY = cy - ry - 50;
    const endY = cy + ry + 50;
    const lineHeight = fontSize * 1.6;

    for (let y = startY; y < endY; y += lineHeight) {
        const [startX, lineWidth] = getBounds(y, timestamp);
        
        if (lineWidth > 40) {
            const line = layoutNextLine(prepared, cursor, lineWidth);
            if (line === null) break;
            
            ctx.fillText(line.text, startX, y + lineHeight * 0.8);
            cursor = line.end;
        }
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
