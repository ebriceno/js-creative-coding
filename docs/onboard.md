# Repository Onboarding

## Project Purpose

This repository is a JavaScript creative-coding workspace for course sketches. It uses browser Canvas 2D and `canvas-sketch` for repeatable, export-friendly sketches.

The active work is split into two chapter folders:

- `v1/`: new sketches for the first course chapter.
- `v2/`: new sketches for the second course chapter.

Older sketches live in `playground/` and are kept for reference. Treat them as examples to inspect, not as the place for new work.

## Runtime Model

The repository has one shared Node project at the root. Dependencies are installed once into the root `node_modules/` directory and are shared by sketches in `v1/`, `v2/`, and `playground/`.

Typical setup from the repository root:

```sh
npm install
```

Do not create separate `package.json` files or run `npm install` inside `v1/`, `v2/`, or `playground/` unless the project intentionally changes to a multi-package workspace later.

Typical sketch run from the repository root:

```sh
npm run sketch -- v1/my-sketch.js --open
npm run sketch -- v2/my-sketch.js --open
```

Reference sketches can also be launched by path:

```sh
npm run sketch -- playground/sketch-03.js --open
```

New sketches can be created with:

```sh
npm run new:v1 -- v1/name-your-project.js
npm run new:v2 -- v2/name-your-project.js
```

These scripts use the root-local `canvas-sketch-cli`, so no global `canvas-sketch` install is required.

## Dependencies

`package.json` declares the shared creative-coding dependencies:

- `canvas-sketch`: sketch runner API used by sketch files.
- `canvas-sketch-cli`: command-line runner used to launch sketches in a browser.
- `canvas-sketch-util`: utilities for random number generation, math helpers, and noise.
- `tweakpane`: browser UI controls for interactive parameters.

Add new libraries only to the root `package.json`, then run `npm install` from the root.

## Repository Layout

```text
.
├── README.md
├── docs/
│   └── onboard.md
├── package.json
├── package-lock.json
├── playground/
│   ├── basics.html
│   └── sketch-*.js
├── v1/
│   └── .gitkeep
└── v2/
    └── .gitkeep
```

`v1/` and `v2/` intentionally start empty except for `.gitkeep` so Git keeps the chapter folders in the repository.

## Current Sketch Areas

### `v1/`

Use this folder for new sketches related to the first chapter of the course.

### `v2/`

Use this folder for new sketches related to the second chapter of the course.

### `playground/`

This folder contains older reference material:

- `basics.html`: raw Canvas API starter example.
- `sketch-01.js`: canvas-sketch grid-square example.
- `sketch-02.js`: radial composition with trigonometry and utility imports.
- `sketch-03.js`: simple vector/agent modeling.
- `sketch-04.js`: transitional noise-grid sketch.
- `sketch-05.js`: complete animated noise-grid sketch with Tweakpane controls.
- `sketch-06.js` and `sketch-07.js`: newer reference sketches kept outside the active chapter folders.

Do not assume playground files are production-ready. Some are intentionally transitional course material.

## Canvas and Rendering Patterns

Common patterns across the reference sketches:

- Clear the whole frame first with `context.fillRect(0, 0, width, height)`.
- Use proportional measurements so sketches scale with canvas size.
- Use `context.beginPath()` before new vector shapes.
- Use `context.save()` and `context.restore()` around transformations.
- Translate to a local origin before drawing centered shapes.
- Draw centered shapes with negative half-width offsets, for example `-w * 0.5`.

Canvas transformations accumulate. Any sketch that calls `translate`, `rotate`, or `scale` inside a loop should normally pair `context.save()` with `context.restore()` inside that same loop iteration.

## Randomness and Determinism

Most reference sketches use unseeded randomness, which is fine for exploration but means output can change between renders.

For reproducible output:

1. Set a seed with `canvas-sketch-util/random`.
2. Precompute random values once in the outer `sketch` function.
3. Store generated agents, colors, or parameters outside the per-frame render callback.

## Practical Extension Guidance

When adding a new sketch:

1. Put it in `v1/` or `v2/`, depending on the course chapter.
2. Run it from the repository root with `npm run sketch -- path/to/sketch.js --open`.
3. Keep generated state outside the render callback when it should remain stable across frames.
4. Use `context.save()` and `context.restore()` around per-object transforms.
5. Prefer canvas-size-relative measurements over hard-coded pixel values.
6. Add any new runtime dependency to the root `package.json`.
7. Leave `playground/` files as reference unless explicitly updating archival examples.

## Validation

There are no automated tests or linting configuration. For a quick syntax check on a sketch:

```sh
node --check v1/my-sketch.js
```

For runtime validation, launch the sketch in the browser with `npm run sketch -- ... --open`.
