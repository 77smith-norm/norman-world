# Hero Variants Runbook

Use this when adding a new Norman hero image pair (light + dark) to the homepage cycler, or when changing which pair is the default.

The homepage hero on `index.html` is a click/tap cycler that rotates through every variant in the current theme. Each variant is one **pair**: one light image and one dark image with matching art direction. Light pairs only show in light mode; dark pairs only show in dark mode. Clicking the hero advances both lists in lockstep so the theme toggle always reveals the matching companion.

## Rule

A variant pair consists of exactly two PNG files under `assets/`:

- `assets/norman_world_<slug>.png` — light-mode image
- `assets/norman_world_<slug>_dark.png` — dark-mode image

`<slug>` is lowercase, snake_case, and unique among existing variants. The `_dark` suffix is required and is what distinguishes the dark image. The unsuffixed original pair (`assets/norman_world.png` and `assets/norman_world_dark.png`) is the historical default and has an empty slug.

The current default pair (first in the cycle) is `norman_world_plumo` / `norman_world_plumo_dark`.

## Image Specs

- Format: PNG.
- Aspect: roughly square or 4:5 portrait; match the visual weight of the existing pairs so layout does not jump between variants.
- Light pair: light or pastel background, suitable for `--bg-color: #ffffff`.
- Dark pair: dark or night-sky background, suitable for `--bg-color: #141414`.
- Size budget: aim for ≤ ~700 KB per PNG so the homepage stays light. Quantize to a 256-color palette if needed.
- Both images in a pair should be the same pixel dimensions as each other so the cycle does not reflow.

## Inputs

Required before wiring the variant in:

- `assets/norman_world_<slug>.png`
- `assets/norman_world_<slug>_dark.png`

## Steps

1. Drop the two PNGs into `assets/`.

   ```bash
   ls assets/norman_world_<slug>.png assets/norman_world_<slug>_dark.png
   ```

2. (Optional) Quantize to keep the size budget.

   ```bash
   python3 - <<'PY'
   from PIL import Image
   for name in ["norman_world_<slug>.png", "norman_world_<slug>_dark.png"]:
       p = f"assets/{name}"
       img = Image.open(p)
       img.quantize(colors=256, method=Image.Quantize.MEDIANCUT,
                    dither=Image.Dither.FLOYDSTEINBERG).save(p, "PNG", optimize=True)
   PY
   ls -la assets/norman_world_<slug>*.png
   ```

3. Append the slug to both `data-variants` lists in `index.html`. Find the hero block:

   ```html
   <div class="hero-image" data-hero-cycler role="button" tabindex="0"
        aria-label="Show next Norman variant" title="Tap for another Norman">
       <img class="light-img" src="assets/norman_world_plumo.png" alt="Norman World"
            data-variants="norman_world_plumo,norman_world">
       <img class="dark-img" src="assets/norman_world_plumo_dark.png" alt="Norman World"
            data-variants="norman_world_plumo_dark,norman_world_dark">
   </div>
   ```

   Append `,<slug>` to the light `data-variants` and `,<slug>_dark` to the dark `data-variants`. Order of the comma list **is** the cycle order. Both lists must be the same length; the cycler clips to `min(length)` of the two.

   No JS change is needed — `js/hero-variants.js` reads the lists at runtime.

4. (Optional) Promote the new pair to the default. Three edits in `index.html`, all to the slug only:

   - `<meta property="og:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world_<slug>.png">`
   - `<meta name="twitter:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world_<slug>.png">`
   - The light `<img>` `src` and the dark `<img>` `src` in the hero block.

   The default pair must be the **first** entry in both `data-variants` lists. If you promote a pair, move its slug to the head of both lists.

   If you promote a different pair, also update the enforced defaults in `src/lib/site-invariants.ts`:

   ```ts
   const DEFAULT_HERO_LIGHT = "norman_world_<slug>";
   const DEFAULT_HERO_DARK = "norman_world_<slug>_dark";
   ```

   And update the matching strings in `src/lib/site-invariants.test.ts`, `AGENTS.md`, `docs/runbooks/content-validation.md`, `docs/openclaw-cron-prompt.md`, and `docs/2026-05-02-current-state.md`.

5. Bump the stylesheet cache buster in `index.html` if you changed `style.css`:

   ```html
   <link rel="stylesheet" href="style.css?v=NN">
   ```

   No bump is needed for an image-only addition.

6. Validate.

   ```bash
   bun run check
   bun run content:validate --pretty
   ```

   Expected:

   ```json
   { "ok": true, "entries": <count> }
   ```

7. Manual smoke test in a browser.

   ```bash
   bun run build
   ```

   Open `index.html`, confirm:

   - Light mode shows the new default light image.
   - Clicking the hero rotates to the next variant.
   - Switching to dark mode shows the dark partner of whatever index the cycle is on.
   - Tab-focusing the hero and pressing Enter or Space also advances the cycle.

## Expected Outputs

- Two new PNGs under `assets/`.
- One edited `index.html` (variant lists, optionally the four default references).
- If the default changed: matching slug updates across `src/lib/site-invariants.{ts,test.ts}`, `AGENTS.md`, and the three docs listed in step 4.

## Failure Handling

- **Cycle stalls on click.** `js/hero-variants.js` requires `length >= 2`. Either both `data-variants` lists are length 1, or one is empty. Re-check the comma string.
- **Theme toggle shows mismatched art.** Light and dark lists are out of order or different lengths. The slugs at each index must describe the same pair.
- **Validator: "Homepage hero light image must default to assets/..."** The first `src` on `.light-img` does not match `DEFAULT_HERO_LIGHT` in `site-invariants.ts`. Either revert the default or update the constant + the docs in step 4.
- **Validator: "Homepage OG image must be a norman_world hero variant under assets/"** The `og:image` URL points outside `assets/norman_world*.png`. Fix the meta tag.
- **Pre-commit hook strips PNG bytes.** `scripts/optimize_staged_pngs.py` calls Tinify and needs `TINIFY_API_KEY`. Without it the script skips optimization; do not bypass the hook to commit unoptimized images larger than the size budget.
