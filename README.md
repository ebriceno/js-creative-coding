# js-creative-coding
JavaScript visuals examples

## Repository structure

- `v1/` contains new sketches for the first course chapter.
- `v2/` contains new sketches for the second course chapter.
- `playground/` contains older sketches kept for reference only.
- `docs/` contains Markdown notes for AI/context onboarding.
- `package.json` and `node_modules/` stay at the repository root so dependencies are shared by every sketch folder.

## To run the examples you need to install:

- [Node.js](https://nodejs.org/en/download/)
- [canvas-sketch](https://github.com/mattdesl/canvas-sketch)

## Setup

Run installs only from the repository root:

```sh
npm install
```

Do not run `npm install` inside `v1/`, `v2/`, or `playground/`. Node and `canvas-sketch` resolve packages from the shared root `node_modules/` folder.

## Running sketches

From the repository root:

```sh
npm run sketch -- v1/my-sketch.js --open
npm run sketch -- v2/my-sketch.js --open
npm run sketch -- playground/sketch-03.js --open
```

You can also use `npx` directly:

```sh
npx canvas-sketch v1/my-sketch.js --open
```

## If you want to create your own sketch project file just type

```sh
npm run new:v1 -- v1/name-your-project.js
npm run new:v2 -- v2/name-your-project.js
```

## Resources

- canvas-sketch [documentation](https://github.com/mattdesl/canvas-sketch/blob/master/docs/README.md)
- canvas-sketch [examples](https://github.com/mattdesl/canvas-sketch/tree/master/examples)
- You can also explore [Sketch.js](https://soulwire.github.io/sketch.js/). Another JS Creative Coding Framework
- [CanvasRenderingContext2D - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

**Happy coding! :)**
