const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  skin: '#d98b5f',
  hair: 'short',
  hairColor: '#2b1710',
  shirt: '#1f8dd6',
  pants: '#26324a',
  shoes: '#161616',
  eyes: 'dots',
  mouth: 'smile',
  accessory: 'none',
  pose: 'idle',
  scale: 1,
  background: 'grid'
};

const palettes = {
  skin: ['#f1c27d', '#d98b5f', '#8d5524', '#ffdbac', '#c68642'],
  hair: ['#2b1710', '#6b3e20', '#d79a2b', '#111111', '#b44a2a'],
  clothes: ['#1f8dd6', '#d64545', '#42a85f', '#f2c14e', '#9b5de5'],
  pants: ['#26324a', '#402a1f', '#202020', '#2f6f73', '#5b3c88']
};

const pick = (list) => list[random.rangeFloor(0, list.length)];

const randomize = () => {
  params.skin = pick(palettes.skin);
  params.hair = pick(['none', 'short', 'flat top', 'mohawk', 'long']);
  params.hairColor = pick(palettes.hair);
  params.shirt = pick(palettes.clothes);
  params.pants = pick(palettes.pants);
  params.shoes = pick(['#161616', '#3a2418', '#f6f1d1']);
  params.eyes = pick(['dots', 'sleepy', 'wide']);
  params.mouth = pick(['smile', 'neutral', 'frown']);
  params.accessory = pick(['none', 'glasses', 'hat', 'headphones']);
  params.pose = pick(['idle', 'wave', 'arms down']);
  params.background = pick(['grid', 'spotlight', 'checker']);
};

const drawPixel = (context, gx, gy, color, pixel) => {
  context.fillStyle = color;
  context.fillRect(gx * pixel, gy * pixel, pixel, pixel);
};

const drawRect = (context, gx, gy, gw, gh, color, pixel) => {
  context.fillStyle = color;
  context.fillRect(gx * pixel, gy * pixel, gw * pixel, gh * pixel);
};

const drawBackground = (context, width, height) => {
  context.fillStyle = '#101018';
  context.fillRect(0, 0, width, height);

  if (params.background === 'checker') {
    const size = width / 18;

    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const even = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
        context.fillStyle = even ? '#171725' : '#0c0c14';
        context.fillRect(x, y, size, size);
      }
    }
  }

  if (params.background === 'grid') {
    context.strokeStyle = '#25253a';
    context.lineWidth = 2;

    for (let x = 0; x <= width; x += width / 18) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += height / 18) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  if (params.background === 'spotlight') {
    const glow = context.createRadialGradient(
      width * 0.5,
      height * 0.48,
      width * 0.05,
      width * 0.5,
      height * 0.48,
      width * 0.52
    );
    glow.addColorStop(0, '#2f2f55');
    glow.addColorStop(0.5, '#171725');
    glow.addColorStop(1, '#08080d');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  context.fillStyle = '#f2c14e';
  context.font = `${Math.floor(width * 0.042)}px monospace`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('8-BIT CHARACTER CREATOR', width * 0.5, height * 0.12);

  context.fillStyle = '#5f668a';
  context.font = `${Math.floor(width * 0.018)}px monospace`;
  context.fillText('EDIT WITH TWEAKPANE', width * 0.5, height * 0.17);
};

const drawHead = (context, pixel) => {
  drawRect(context, 5, 4, 6, 1, params.skin, pixel);
  drawRect(context, 4, 5, 8, 5, params.skin, pixel);
  drawRect(context, 5, 10, 6, 1, params.skin, pixel);
  drawRect(context, 6, 11, 4, 1, params.skin, pixel);

  drawPixel(context, 4, 7, '#9d5e3f', pixel);
  drawPixel(context, 11, 7, '#9d5e3f', pixel);
};

const drawHair = (context, pixel) => {
  if (params.hair === 'none') return;

  if (params.hair === 'short') {
    drawRect(context, 4, 3, 8, 2, params.hairColor, pixel);
    drawPixel(context, 4, 5, params.hairColor, pixel);
    drawPixel(context, 11, 5, params.hairColor, pixel);
  }

  if (params.hair === 'flat top') {
    drawRect(context, 4, 2, 8, 3, params.hairColor, pixel);
  }

  if (params.hair === 'mohawk') {
    drawRect(context, 7, 1, 2, 4, params.hairColor, pixel);
    drawRect(context, 5, 4, 6, 1, params.hairColor, pixel);
  }

  if (params.hair === 'long') {
    drawRect(context, 4, 3, 8, 2, params.hairColor, pixel);
    drawRect(context, 3, 5, 2, 6, params.hairColor, pixel);
    drawRect(context, 11, 5, 2, 6, params.hairColor, pixel);
  }
};

const drawFace = (context, pixel) => {
  const eyeColor = '#111111';

  if (params.eyes === 'dots') {
    drawPixel(context, 6, 7, eyeColor, pixel);
    drawPixel(context, 9, 7, eyeColor, pixel);
  }

  if (params.eyes === 'sleepy') {
    drawRect(context, 6, 7, 2, 1, eyeColor, pixel);
    drawRect(context, 9, 7, 2, 1, eyeColor, pixel);
  }

  if (params.eyes === 'wide') {
    drawRect(context, 6, 7, 2, 2, '#ffffff', pixel);
    drawRect(context, 9, 7, 2, 2, '#ffffff', pixel);
    drawPixel(context, 6, 8, eyeColor, pixel);
    drawPixel(context, 9, 8, eyeColor, pixel);
  }

  if (params.mouth === 'smile') {
    drawPixel(context, 6, 9, '#6b2a2a', pixel);
    drawRect(context, 7, 10, 2, 1, '#6b2a2a', pixel);
    drawPixel(context, 9, 9, '#6b2a2a', pixel);
  }

  if (params.mouth === 'neutral') {
    drawRect(context, 6, 10, 4, 1, '#6b2a2a', pixel);
  }

  if (params.mouth === 'frown') {
    drawPixel(context, 6, 10, '#6b2a2a', pixel);
    drawRect(context, 7, 9, 2, 1, '#6b2a2a', pixel);
    drawPixel(context, 9, 10, '#6b2a2a', pixel);
  }
};

const drawBody = (context, pixel) => {
  drawRect(context, 5, 12, 6, 6, params.shirt, pixel);
  drawRect(context, 4, 13, 2, 3, params.shirt, pixel);
  drawRect(context, 10, 13, 2, 3, params.shirt, pixel);
  drawRect(context, 6, 18, 2, 4, params.pants, pixel);
  drawRect(context, 8, 18, 2, 4, params.pants, pixel);
  drawRect(context, 5, 22, 3, 1, params.shoes, pixel);
  drawRect(context, 8, 22, 3, 1, params.shoes, pixel);

  if (params.pose === 'idle') {
    drawRect(context, 3, 16, 2, 4, params.skin, pixel);
    drawRect(context, 11, 16, 2, 4, params.skin, pixel);
  }

  if (params.pose === 'wave') {
    drawRect(context, 3, 16, 2, 4, params.skin, pixel);
    drawRect(context, 11, 12, 2, 2, params.skin, pixel);
    drawRect(context, 12, 10, 2, 3, params.skin, pixel);
    drawPixel(context, 13, 9, params.skin, pixel);
  }

  if (params.pose === 'arms down') {
    drawRect(context, 3, 14, 2, 6, params.skin, pixel);
    drawRect(context, 11, 14, 2, 6, params.skin, pixel);
  }
};

const drawAccessory = (context, pixel) => {
  if (params.accessory === 'none') return;

  if (params.accessory === 'glasses') {
    drawRect(context, 5, 7, 3, 2, '#111111', pixel);
    drawRect(context, 9, 7, 3, 2, '#111111', pixel);
    drawRect(context, 8, 8, 1, 1, '#111111', pixel);
    drawPixel(context, 6, 7, '#9be7ff', pixel);
    drawPixel(context, 10, 7, '#9be7ff', pixel);
  }

  if (params.accessory === 'hat') {
    drawRect(context, 3, 3, 10, 1, '#d64545', pixel);
    drawRect(context, 5, 1, 6, 2, '#d64545', pixel);
    drawRect(context, 6, 2, 4, 1, '#f2c14e', pixel);
  }

  if (params.accessory === 'headphones') {
    drawRect(context, 4, 5, 1, 4, '#111111', pixel);
    drawRect(context, 11, 5, 1, 4, '#111111', pixel);
    drawRect(context, 5, 3, 6, 1, '#111111', pixel);
    drawRect(context, 3, 7, 2, 3, '#f2c14e', pixel);
    drawRect(context, 11, 7, 2, 3, '#f2c14e', pixel);
  }
};

const drawCharacter = (context, width, height) => {
  const basePixel = Math.floor(Math.min(width, height) / 32);
  const pixel = Math.floor(basePixel * params.scale);
  const spriteW = 16 * pixel;
  const spriteH = 24 * pixel;
  const x = (width - spriteW) * 0.5;
  const y = (height - spriteH) * 0.55;

  context.save();
  context.translate(x, y);
  context.imageSmoothingEnabled = false;

  context.fillStyle = 'rgba(0, 0, 0, 0.35)';
  context.fillRect(3 * pixel, 23 * pixel, 10 * pixel, pixel);

  drawBody(context, pixel);
  drawHead(context, pixel);
  drawHair(context, pixel);
  drawFace(context, pixel);
  drawAccessory(context, pixel);

  context.restore();

  context.fillStyle = '#0b0b12';
  context.fillRect(width * 0.31, height * 0.82, width * 0.38, height * 0.035);
  context.fillStyle = '#f2c14e';
  context.font = `${Math.floor(width * 0.02)}px monospace`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(`${params.hair.toUpperCase()} / ${params.accessory.toUpperCase()}`, width * 0.5, height * 0.837);
};

const sketch = () => {
  return ({ context, width, height }) => {
    drawBackground(context, width, height);
    drawCharacter(context, width, height);
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Body' });
  folder.addInput(params, 'skin');
  folder.addInput(params, 'hair', {
    options: {
      none: 'none',
      short: 'short',
      'flat top': 'flat top',
      mohawk: 'mohawk',
      long: 'long'
    }
  });
  folder.addInput(params, 'hairColor');

  folder = pane.addFolder({ title: 'Clothes' });
  folder.addInput(params, 'shirt');
  folder.addInput(params, 'pants');
  folder.addInput(params, 'shoes');

  folder = pane.addFolder({ title: 'Face' });
  folder.addInput(params, 'eyes', {
    options: {
      dots: 'dots',
      sleepy: 'sleepy',
      wide: 'wide'
    }
  });
  folder.addInput(params, 'mouth', {
    options: {
      smile: 'smile',
      neutral: 'neutral',
      frown: 'frown'
    }
  });

  folder = pane.addFolder({ title: 'Style' });
  folder.addInput(params, 'accessory', {
    options: {
      none: 'none',
      glasses: 'glasses',
      hat: 'hat',
      headphones: 'headphones'
    }
  });
  folder.addInput(params, 'pose', {
    options: {
      idle: 'idle',
      wave: 'wave',
      'arms down': 'arms down'
    }
  });
  folder.addInput(params, 'background', {
    options: {
      grid: 'grid',
      spotlight: 'spotlight',
      checker: 'checker'
    }
  });
  folder.addInput(params, 'scale', { min: 0.75, max: 1.35, step: 0.05 });

  pane.addButton({ title: 'Randomize' }).on('click', () => {
    randomize();
    pane.refresh();
  });
};

createPane();
canvasSketch(sketch, settings);
