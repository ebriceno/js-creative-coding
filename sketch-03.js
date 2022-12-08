const canvasSketch = require('canvas-sketch');
const randomUtils = require('canvas-sketch-util/random');

const settings = {
    dimensions: [ 1080, 1080 ],
    // animate: true
};

/* const animate = () => {
    console.log('Animate');
    requestAnimationFrame(animate);
};
animate(); */

const sketch = ({ width, height }) => {

    const agents = [];

    for (let i = 0; i < 40; i++) {
        const x = randomUtils.range(0, height);
        const y = randomUtils.range(0, width);
        agents.push(new Agent(x, y));
    }

    return ({ context, width, height }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        // This nested loop is used to connect the dots
        /* for (let i = 0; i < agents.length; i++) {
            const agent = agents[i];
            for (let j = i + 1; j < agents.length; j++) {
                const other = agents[j];

                // Here we can play with distance between dots to decide
                // when to connect them
                // const distance = agent.position.getDistance(other.position)
                // if (distance > 200) continue;

                context.beginPath();
                context.moveTo(agent.position.x, agent.position.y);
                context.lineTo(other.position.x, other.position.y);
                context.stroke();
            }
        } */

        agents.forEach(agent => {
            // agent.update();
            agent.draw(context);
            // agent.bounce(width, height);
        })
    };
};

canvasSketch(sketch, settings);

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getDistance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class Agent {
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(randomUtils.range(-1, 1), randomUtils.range(-1, 1));
        this.radius = randomUtils.range(4, 12)
    }

    draw(context) {
        context.save();

        context.translate(this.position.x, this.position.y);

        context.lineWidth = 4;
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.restore();
    }

    bounce(width, height) {
        if (this.position.x <= 0 || this.position.x >= width) {
            this.velocity.x *= -1;
        }

        if (this.position.y <= 0 || this.position.y >= height) {
            this.velocity.y *= -1;
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}