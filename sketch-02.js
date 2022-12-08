const canvasSketch = require('canvas-sketch');
const mathUtils = require('canvas-sketch-util/math');
const randomUtils = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 12;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
        const slice = mathUtils.degToRad(360 / num);
        const angle = slice * i;

        x = cx + radius * Math.sin(angle);
        y = cy + radius * Math.cos(angle)

        context.save();
        context.translate(x, y);
        context.rotate(-angle);
        context.scale(randomUtils.range(0.1, 2), randomUtils.range(0.2, 0.5))

        context.beginPath();
        context.rect(-w * 0.5, randomUtils.range(0, -h * 0.5), w, h);
        context.fill();
        context.restore();


        context.save();
        context.translate(cx, cy);
        context.rotate(-angle);

        context.lineWidth = randomUtils.range(5, 20);

        context.beginPath();
        context.arc(0, 0, radius * randomUtils.range(0.7, 1.3), slice * randomUtils.range(1, -8), slice * randomUtils.range(1, 5));
        context.stroke();
        context.restore();

    }
  };
};

canvasSketch(sketch, settings);
