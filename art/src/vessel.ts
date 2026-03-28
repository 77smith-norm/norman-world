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
    
    // 1. CONSTANT WIDTH: The physical text boundary never changes size, preventing jitter.
    let halfWidth = rx * Math.sqrt(rSq);
    let lineWidth = halfWidth * 2;
    
    // 2. SOFT SWAY: Gentle organic drifting of the X coordinate.
    const sway = Math.cos(y * 0.003 - time * 0.0003) * (rx * 0.05);
    
    // 3. GENTLE MOUSE PULL: Subtly bends the shape toward the cursor.
    let pullOffsetX = 0;
    const yDistToMouse = Math.abs(y - mouseY);
    const interactR = Math.max(rx * 1.5, 450); 
    
    if (yDistToMouse < interactR) {
        const falloff = Math.cos((yDistToMouse / interactR) * (Math.PI / 2));
        const pullStrength = falloff * falloff * falloff; 
        
        const dxFromCenter = mouseX - cx;
        pullOffsetX = dxFromCenter * 0.10 * pullStrength; // Very low multiplier for gentleness
    }
    
    let startX = cx - halfWidth + sway + pullOffsetX;
    
    return [startX, lineWidth];
}

function draw(timestamp: number) {
    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

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
    const lineHeight = fontSize * 1.8; 

    for (let y = startY; y < endY; y += lineHeight) {
        const [startX, lineWidth] = getBounds(y, timestamp);
        
        if (lineWidth > 40) {
            const line = layoutNextLine(prepared, cursor, lineWidth);
            if (line === null) break;
            
            // --- THE VISUAL BREATH (COLOR/OPACITY RIPPLE) ---
            
            // 1. The inherent wave (Ebb and flow)
            // Sine wave moving vertically over time. Output is 0.0 to 1.0.
            const wave = (Math.sin(y * 0.006 - timestamp * 0.0008) + 1) / 2;
            
            // 2. The Mouse Aura (Interactive highlight)
            const lineCenterX = startX + lineWidth / 2;
            const distToMouse = Math.hypot(lineCenterX - mouseX, y - mouseY);
            const mouseFocus = Math.max(0, 1 - distToMouse / 350);
            const smoothMouse = mouseFocus * mouseFocus * (3 - 2 * mouseFocus); 
            
            // 3. Composite the effect
            // Base opacity is very low (light grey). 
            // The wave gently pulses it up slightly.
            // The mouse brings it to full contrast (solid black/white depending on theme).
            const alpha = 0.08 + (wave * 0.25) + (smoothMouse * 0.85);
            
            ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
            
            ctx.fillText(line.text, startX, y + lineHeight * 0.8);
            cursor = line.end;
        }
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
