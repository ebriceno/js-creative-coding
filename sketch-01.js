const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1000, 1000 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.01;

    const w = width * 0.10;
    const h = height * 0.10;
    const gap = width * 0.03;
    const initialX = width * 0.17;
    const initialY = height * 0.17;
    const offset = width * 0.02;
    let x, y;


      for(let i = 0; i < 5; i++) {
          for(let j = 0; j < 5; j++) {
              x = initialX + (w + gap) * i;
              y = initialY + (h + gap) * j;

              // Draw outer squares
              context.beginPath();
              context.rect(x, y, w, h);
              context.stroke();

              // Draw inner squares
              context.beginPath();
              context.rect(x + 8, y + 8, w - 16, h - 16);
              context.stroke();

              // Draw random inner inner squares conditionally
              if (Math.round(Math.random())) {
                  // Fixed fill color
                  // context.fillStyle = "red";

                  // Random fill color
                  context.fillStyle = `rgb(
                  ${Math.floor(255 - 42.5 * i)},
                  ${Math.floor(255 - 42.5 * j)},
                  0)`;

                  context.beginPath();
                  context.fillRect(x + offset / 2, y + offset / 2, w - offset, h -offset);
                  context.stroke();
              }
          }
      }
  };
};

canvasSketch(sketch, settings);
