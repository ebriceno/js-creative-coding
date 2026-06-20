const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  bars: 48,
  segments: 24,
  smoothing: 0.16,
  peakFalloff: 0.38,
  playerSpeed: 0.014,
  bulletSpeed: 0.025,
  enemyBaseSpeed: 0.0038,
  spawnChance: 0.055
};

const fireColors = [
  '#3b0500',
  '#6f0b00',
  '#a71900',
  '#df3400',
  '#ff6800',
  '#ff9a00',
  '#ffd000',
  '#fff3a0'
];

const keys = {
  left: false,
  right: false,
  fire: false
};

const createBands = () => {
  return Array.from({ length: params.bars }, (_, index) => ({
    value: random.range(0.12, 0.75),
    target: random.range(0.12, 0.95),
    peak: random.range(0.2, 0.95),
    hold: random.rangeFloor(2, 16),
    speed: random.range(0.7, 1.5),
    phase: index / params.bars
  }));
};

const createGameState = () => ({
  playerX: 0.5,
  bullets: [],
  enemies: [],
  sparks: [],
  score: 0,
  lives: 3,
  cooldown: 0,
  shake: 0,
  over: false
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const drawWindow = (context, x, y, width, height, game) => {
  context.save();

  context.fillStyle = '#070707';
  context.fillRect(x, y, width, height);

  context.strokeStyle = '#f06a00';
  context.lineWidth = 4;
  context.strokeRect(x, y, width, height);

  context.strokeStyle = '#391200';
  context.lineWidth = 2;
  context.strokeRect(x + 12, y + 12, width - 24, height - 24);

  context.fillStyle = '#170600';
  context.fillRect(x + 18, y + 18, width - 36, height * 0.09);

  context.fillStyle = '#ffb000';
  context.font = `${Math.floor(height * 0.034)}px monospace`;
  context.textBaseline = 'middle';
  context.fillText('FIRE EQ DEFENDER', x + 34, y + height * 0.065);

  context.textAlign = 'right';
  context.fillText(`SCORE ${String(game.score).padStart(5, '0')}`, x + width - 34, y + height * 0.065);

  context.textAlign = 'left';
  for (let i = 0; i < game.lives; i++) {
    const ledSize = height * 0.018;
    const ledX = x + width - 230 + i * ledSize * 1.7;
    const ledY = y + height * 0.055;

    context.fillStyle = ['#ff3000', '#ff8a00', '#ffe066'][i] || '#ff3000';
    context.fillRect(ledX, ledY, ledSize, ledSize);
  }

  context.restore();
};

const drawBar = (context, x, bottom, width, segmentHeight, gap, activeSegments, peakSegment) => {
  for (let segment = 0; segment < params.segments; segment++) {
    const y = bottom - (segment + 1) * segmentHeight - segment * gap;
    const ratio = segment / (params.segments - 1);
    const colorIndex = Math.min(
      fireColors.length - 1,
      Math.floor(ratio * fireColors.length)
    );

    context.fillStyle = segment < activeSegments ? fireColors[colorIndex] : '#180604';
    context.fillRect(x, y, width, segmentHeight);

    context.fillStyle = segment < activeSegments ? 'rgba(255, 235, 150, 0.14)' : 'rgba(255, 80, 0, 0.04)';
    context.fillRect(x, y, width, Math.max(1, segmentHeight * 0.2));
  }

  const peakY = bottom - (peakSegment + 1) * segmentHeight - peakSegment * gap;
  context.fillStyle = '#fff6be';
  context.fillRect(x, peakY, width, Math.max(2, segmentHeight * 0.45));
};

const drawPlayer = (context, area, game) => {
  const x = area.x + game.playerX * area.width;
  const y = area.y + area.height * 0.9;
  const unit = area.width * 0.018;

  context.save();
  context.translate(x, y);
  context.shadowColor = 'rgba(255, 166, 0, 0.8)';
  context.shadowBlur = unit * 2.5;

  context.fillStyle = '#ff8a00';
  context.fillRect(-unit * 1.7, -unit * 0.2, unit * 3.4, unit * 0.8);
  context.fillStyle = '#ffd000';
  context.fillRect(-unit * 0.65, -unit * 1.5, unit * 1.3, unit * 1.7);
  context.fillStyle = '#fff3a0';
  context.fillRect(-unit * 0.25, -unit * 2.2, unit * 0.5, unit * 0.9);
  context.fillStyle = '#a71900';
  context.fillRect(-unit * 2.5, unit * 0.3, unit * 1.1, unit * 0.7);
  context.fillRect(unit * 1.4, unit * 0.3, unit * 1.1, unit * 0.7);

  context.restore();
};

const drawEnemy = (context, area, enemy) => {
  const x = area.x + enemy.x * area.width;
  const y = area.y + enemy.y * area.height;
  const w = enemy.w * area.width;
  const h = enemy.h * area.height;

  context.save();
  context.shadowColor = 'rgba(255, 76, 0, 0.85)';
  context.shadowBlur = w * 0.8;

  context.fillStyle = '#6f0b00';
  context.fillRect(x - w * 0.5, y - h * 0.5, w, h);
  context.fillStyle = '#df3400';
  context.fillRect(x - w * 0.38, y - h * 0.34, w * 0.76, h * 0.62);
  context.fillStyle = '#ff9a00';
  context.fillRect(x - w * 0.24, y - h * 0.18, w * 0.48, h * 0.3);
  context.fillStyle = '#fff3a0';
  context.fillRect(x - w * 0.1, y - h * 0.06, w * 0.2, h * 0.11);

  context.restore();
};

const drawBullet = (context, area, bullet) => {
  const x = area.x + bullet.x * area.width;
  const y = area.y + bullet.y * area.height;
  const w = area.width * 0.007;
  const h = area.height * 0.045;

  context.save();
  context.shadowColor = '#fff3a0';
  context.shadowBlur = w * 3;
  context.fillStyle = '#fff3a0';
  context.fillRect(x - w * 0.5, y - h, w, h);
  context.fillStyle = '#ff6800';
  context.fillRect(x - w * 1.3, y - h * 0.35, w * 2.6, h * 0.45);
  context.restore();
};

const addSparks = (game, x, y, amount) => {
  for (let i = 0; i < amount; i++) {
    game.sparks.push({
      x,
      y,
      vx: random.range(-0.012, 0.012),
      vy: random.range(-0.018, 0.008),
      life: random.range(16, 34),
      maxLife: 34,
      color: random.pick(fireColors.slice(3))
    });
  }
};

const spawnEnemy = (game, bandIndex, bandValue) => {
  const barCenter = (bandIndex + 0.5) / params.bars;
  const spread = random.range(-0.018, 0.018);

  game.enemies.push({
    x: clamp(barCenter + spread, 0.03, 0.97),
    y: -0.05,
    w: random.range(0.018, 0.028),
    h: random.range(0.04, 0.065),
    speed: params.enemyBaseSpeed + bandValue * random.range(0.002, 0.006),
    value: Math.round(10 + bandValue * 40)
  });
};

const updateBands = (bands, frame) => {
  bands.forEach((band, index) => {
    if (band.hold <= 0 || frame % Math.max(2, Math.floor(8 / band.speed)) === 0) {
      const bassBias = 1 - index / params.bars;
      const pulse = Math.sin(frame * 0.08 * band.speed + band.phase * Math.PI * 6) * 0.18;

      band.target = random.range(0.08, 0.78) + bassBias * random.range(0.0, 0.2) + pulse;
      band.target = clamp(band.target, 0.04, 1);
      band.hold = random.rangeFloor(2, 12);
    } else {
      band.hold -= 1;
    }

    band.value += (band.target - band.value) * params.smoothing;
    band.peak = Math.max(band.value, band.peak - params.peakFalloff / params.segments);
  });
};

const updateGame = (game, bands, frame) => {
  if (game.over) {
    if (keys.fire) {
      Object.assign(game, createGameState());
    }
    return;
  }

  if (keys.left) game.playerX -= params.playerSpeed;
  if (keys.right) game.playerX += params.playerSpeed;
  game.playerX = clamp(game.playerX, 0.035, 0.965);

  if (game.cooldown > 0) game.cooldown -= 1;
  if (keys.fire && game.cooldown <= 0) {
    game.bullets.push({ x: game.playerX, y: 0.86 });
    game.cooldown = 8;
  }

  if (frame % 3 === 0) {
    const hotBands = bands
      .map((band, index) => ({ index, value: band.value }))
      .filter((band) => band.value > 0.62);

    if (hotBands.length > 0 && random.chance(params.spawnChance)) {
      const band = random.pick(hotBands);
      spawnEnemy(game, band.index, band.value);
    }
  }

  game.bullets.forEach((bullet) => {
    bullet.y -= params.bulletSpeed;
  });

  game.enemies.forEach((enemy) => {
    enemy.y += enemy.speed;
  });

  game.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.0008;
    spark.life -= 1;
  });

  for (let enemyIndex = game.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    const enemy = game.enemies[enemyIndex];

    for (let bulletIndex = game.bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
      const bullet = game.bullets[bulletIndex];
      const hitX = Math.abs(bullet.x - enemy.x) < enemy.w * 0.75;
      const hitY = bullet.y > enemy.y - enemy.h * 0.7 && bullet.y < enemy.y + enemy.h * 0.7;

      if (hitX && hitY) {
        game.score += enemy.value;
        addSparks(game, enemy.x, enemy.y, 14);
        game.enemies.splice(enemyIndex, 1);
        game.bullets.splice(bulletIndex, 1);
        break;
      }
    }
  }

  for (let i = game.enemies.length - 1; i >= 0; i--) {
    const enemy = game.enemies[i];
    const playerHit = enemy.y > 0.84 && Math.abs(enemy.x - game.playerX) < enemy.w * 1.4;

    if (enemy.y > 1.05 || playerHit) {
      game.enemies.splice(i, 1);
      game.lives -= 1;
      game.shake = 10;
      addSparks(game, enemy.x, Math.min(enemy.y, 0.92), 24);

      if (game.lives <= 0) {
        game.over = true;
      }
    }
  }

  game.bullets = game.bullets.filter((bullet) => bullet.y > -0.08);
  game.sparks = game.sparks.filter((spark) => spark.life > 0);
  if (game.shake > 0) game.shake -= 1;
};

const drawSparks = (context, area, game) => {
  game.sparks.forEach((spark) => {
    const alpha = spark.life / spark.maxLife;
    const size = area.width * 0.006 * alpha;

    context.fillStyle = spark.color;
    context.globalAlpha = alpha;
    context.fillRect(
      area.x + spark.x * area.width - size * 0.5,
      area.y + spark.y * area.height - size * 0.5,
      size,
      size
    );
  });
  context.globalAlpha = 1;
};

const drawScanlines = (context, width, height) => {
  context.strokeStyle = 'rgba(255, 166, 0, 0.12)';
  context.lineWidth = 1;

  for (let y = 0; y < height; y += 6) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
};

const drawEndState = (context, x, y, width, height, game) => {
  if (!game.over) return;

  context.save();
  context.fillStyle = 'rgba(3, 1, 0, 0.78)';
  context.fillRect(x, y, width, height);

  context.fillStyle = '#fff3a0';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `${Math.floor(height * 0.095)}px monospace`;
  context.fillText('GAME OVER', x + width * 0.5, y + height * 0.44);

  context.fillStyle = '#ff8a00';
  context.font = `${Math.floor(height * 0.045)}px monospace`;
  context.fillText(`FINAL SCORE ${String(game.score).padStart(5, '0')}`, x + width * 0.5, y + height * 0.54);

  context.restore();
};

const attachInput = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') keys.left = true;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') keys.right = true;
    if (event.code === 'Space' || event.code === 'Enter') keys.fire = true;

    if (['ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
      event.preventDefault();
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') keys.left = false;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') keys.right = false;
    if (event.code === 'Space' || event.code === 'Enter') keys.fire = false;
  });
};

const sketch = () => {
  const bands = createBands();
  const game = createGameState();

  attachInput();

  return ({ context, width, height, frame }) => {
    updateBands(bands, frame);
    updateGame(game, bands, frame);

    context.fillStyle = '#030100';
    context.fillRect(0, 0, width, height);

    const panelW = width * 0.84;
    const panelH = height * 0.6;
    const panelX = (width - panelW) * 0.5;
    const panelY = (height - panelH) * 0.5;
    const shakeX = game.shake > 0 ? random.range(-4, 4) : 0;
    const shakeY = game.shake > 0 ? random.range(-4, 4) : 0;

    context.save();
    context.translate(shakeX, shakeY);

    drawWindow(context, panelX, panelY, panelW, panelH, game);

    const meterX = panelX + panelW * 0.06;
    const meterY = panelY + panelH * 0.18;
    const meterW = panelW * 0.88;
    const meterH = panelH * 0.72;
    const bottom = meterY + meterH;
    const barGap = meterW * 0.006;
    const barW = (meterW - barGap * (params.bars - 1)) / params.bars;
    const segmentGap = meterH * 0.006;
    const segmentH = (meterH - segmentGap * (params.segments - 1)) / params.segments;
    const playArea = {
      x: meterX,
      y: meterY,
      width: meterW,
      height: meterH
    };

    context.save();
    context.shadowColor = 'rgba(255, 95, 0, 0.55)';
    context.shadowBlur = width * 0.014;

    bands.forEach((band, index) => {
      const activeSegments = Math.max(1, Math.round(band.value * params.segments));
      const peakSegment = Math.min(
        params.segments - 1,
        Math.max(activeSegments, Math.round(band.peak * params.segments) - 1)
      );
      const x = meterX + index * (barW + barGap);

      drawBar(context, x, bottom, barW, segmentH, segmentGap, activeSegments, peakSegment);
    });

    context.restore();

    game.enemies.forEach((enemy) => drawEnemy(context, playArea, enemy));
    game.bullets.forEach((bullet) => drawBullet(context, playArea, bullet));
    drawSparks(context, playArea, game);
    drawPlayer(context, playArea, game);
    drawEndState(context, panelX, panelY, panelW, panelH, game);

    context.restore();

    const glow = context.createRadialGradient(
      width * 0.5,
      height * 0.62,
      width * 0.08,
      width * 0.5,
      height * 0.62,
      width * 0.58
    );
    glow.addColorStop(0, 'rgba(255, 98, 0, 0.14)');
    glow.addColorStop(0.55, 'rgba(125, 18, 0, 0.08)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    drawScanlines(context, width, height);
  };
};

canvasSketch(sketch, settings);
