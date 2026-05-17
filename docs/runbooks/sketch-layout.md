# Sketch Layout Runbook

Use this when `bun run content:validate` flags a sketch layout error, or when an entry page's p5.js sketch visually appears below the rest of the content (after the theme toggle, the footer, or "Inspiration") instead of in its own `<section class="sketch">` slot.

## Symptom

The canvas renders, but in the wrong place: at the very bottom of `<body>`, below the theme toggle, with no styling box around it. Everything above it looks normal.

## Root Cause

p5.js, when running in global mode, appends its canvas to `document.body` unless you reparent it. The canonical entry layout puts a `<div id="sketch-container"></div>` inside `<section class="sketch">`, and the sketch script must do:

```js
const cnv = createCanvas(w, h);
cnv.parent('sketch-container');
```

If the sketch calls `createCanvas(...)` but never `.parent('sketch-container')`, the canvas falls out of the layout. This is the dominant break mode.

A secondary break mode is the entry page lacking the mount element entirely — usually because someone edited `pages/YYYY-MM-DD.html` by hand and dropped the `<div id="sketch-container">`.

## Rule

For every entry there are two artifacts and three invariants:

1. **`pages/YYYY-MM-DD.html`** must contain a `<section class="sketch">` that includes:
   - `<div id="sketch-container"></div>` (or the legacy `<div id="canvas-container"></div>`), and
   - a `<script>` loading p5.js (anywhere in the document — `<head>` or inside the section).
2. **`js/YYYY-MM-DD.js`** must call `createCanvas(...)` (or `new p5(..., 'sketch-container')`).
3. The sketch must reparent its canvas: `cnv.parent('sketch-container')` (or `'canvas-container'` if the page uses that id).

The default container id for new entries is `sketch-container`. `canvas-container` exists for backward compatibility with early entries; do not introduce new ones.

## Detection

```bash
bun run content:validate --pretty
```

Layout errors surface as:

- `Sketch calls createCanvas() but never \`.parent('sketch-container')\` ...` — broken sketch JS.
- `Entry page is missing a sketch mount inside <section class="sketch">` — broken page HTML.
- `Entry page does not load p5.js` — page is missing the p5 CDN `<script>`.
- `Sketch never calls createCanvas() or \`new p5(...)\`` — sketch is empty or no-op.

You can also pre-scan all sketch files manually:

```bash
grep -L "\.parent(" js/2026-*.js
```

Any file printed here is missing a `.parent(...)` call and is suspect.

## Steps to Fix

1. Locate the broken sketch slug from the validator output.

2. Open `js/YYYY-MM-DD.js` and find the `setup()` function.

3. Capture the `createCanvas(...)` return value and parent it. The minimal change is two lines:

   Before:

   ```js
   function setup() {
     createCanvas(windowWidth, windowHeight);
     // ...
   }
   ```

   After:

   ```js
   function setup() {
     const cnv = createCanvas(windowWidth, windowHeight);
     cnv.parent('sketch-container');
     // ...
   }
   ```

   If the page uses `canvas-container` (rare; legacy entries from February 2026), parent to that id instead. Inspect the page first:

   ```bash
   grep -o 'id="[^"]*-container"' pages/YYYY-MM-DD.html
   ```

4. If the sketch also has a `windowResized()` that recreates the canvas (e.g. `createCanvas(...)` inside `windowResized`), apply the same `.parent(...)` to that call too.

5. If the validator reports the page (not the sketch) is missing the mount or the p5 CDN, edit `pages/YYYY-MM-DD.html` so the `<section class="sketch">` matches `templates/entry.html`:

   ```html
   <section class="sketch">
       <div id="sketch-container"></div>
       <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
       <script src="../js/YYYY-MM-DD.js"></script>
   </section>
   ```

6. Re-validate.

   ```bash
   bun run content:validate --pretty
   ```

   Expected:

   ```json
   { "ok": true, "entries": <count> }
   ```

7. Spot-check in a browser. Open the entry page and confirm the canvas sits inside the gray sketch box between the portrait and the Inspiration list, not below the theme toggle.

## Expected Outputs

- Edited `js/YYYY-MM-DD.js` (and `windowResized` if applicable) with the `.parent(...)` call(s).
- Or edited `pages/YYYY-MM-DD.html` with a complete `<section class="sketch">` block.
- A clean `bun run content:validate --pretty` run.

## Failure Handling

- **Validator still flags the file after the edit.** Check that the `.parent(...)` argument is a string literal matching `sketch-container` (or `canvas-container`) exactly. `cnv.parent(sketchContainer)` with a variable will not be detected and will not work either if the variable isn't a DOM id.
- **Multiple `createCanvas` calls in one file.** Each one must be parented. `windowResized()` commonly re-runs `createCanvas`; pair every call with a matching `.parent(...)`.
- **Canvas is parented but still appears in the wrong place.** Confirm the page has `<div id="sketch-container">` (or `canvas-container`) — the .parent call needs a real mount element. If both are present and it still misbehaves, check `style.css` rules for `#sketch-container` / `#canvas-container` near `style.css:236` and confirm the section CSS has not been overridden.
- **Sketch uses p5 instance mode (`new p5(fn, 'sketch-container')`).** The validator accepts this. If you switch a sketch to instance mode, make sure the mount-id string is still `sketch-container`.
- **Page works locally but flagged by validator.** Look for a non-empty body inside `<div id="sketch-container">…</div>` — the validator expects the div to be empty (only whitespace between the open and close tags). p5.js appends the canvas at runtime; any static content inside the div will throw off the regex. Match the template exactly.
