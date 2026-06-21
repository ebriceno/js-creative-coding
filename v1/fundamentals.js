const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 600, 600 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#C9F2E1';
    context.fillRect(0, 0, width, height);

    const gap = 10;
    const h = 108;
    const w = 108;
    

    const xi = 40;
    const yi = 40;

    console.log(w, h, gap, xi, yi);

    for(let i = 0; i < 5; i++) {
      for(let j = 0; j < 5; j++) {
        // Change next shape fill color
        context.fillStyle = "#C5F0B9";
        context.strokeStyle = '#C9F2E1';

        // Draw an empty rectangle
        context.strokeRect(xi + i * w, yi + j * h, w - gap, h - gap);

        const seed = Math.random();
        console.log(seed);

        if(seed > 0.6) {
          context.fillStyle = "#FFBC70";
          // Draw a filled circle
          context.beginPath();
          context.arc(xi + i * w + ((w/2) - (gap/2)), yi + j * h + ((h/2) - (gap/2)), 25, 0, Math.PI * 2);
          context.fill();
        }
        
        if(seed < 0.4) {
          context.fillStyle = "#D9D5E6";

          // Draw a filled rectangle
          context.fillRect(xi + i * w + 5, yi + j * h + 5, w - gap*2, h - gap*2);
        }

        if(seed >= 0.4 && seed <= 0.6) {
          context.fillStyle = "#DEC2C1";
          // Draw a filled triangle
          context.beginPath();
          context.moveTo(xi + i * w + ((w/2) - (gap/2)), yi + j * h + 5);
          context.lineTo(xi + i * w + 5, yi + j * h + h - gap*2);
          context.lineTo(xi + i * w + w - gap*2, yi + j * h + h - gap*2);
          context.closePath();
          context.fill();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
