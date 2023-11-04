import { getColorByValue } from "./utils/getColorByValue";
import { getRandomInt } from "./utils/getRandomInt";

export class AsteroidsRenderer {
    asteroids = [];

    constructor(ctx, template, sceneWidth, sceneHeight) {
        this.ctx = ctx;
        this.template = template
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;

        this.generateAsteroids();
    }

    generateAsteroids = () => {
        for (let j = 0; j < this.sceneHeight; j++) {
            for (let i = 0; i < this.sceneWidth * 10; i++) {
                const random = getRandomInt(50000);

                if (random === 10) {
                    this.asteroids.push({ x: i + this.sceneWidth, y: j  });
                }
            }
        }
    }

    renderAsteroid = (posX, posY, coef = 1) => {
        for(let j = 0; j < this.template.length; j++) {
            const row = this.template[j];

            for (let i = 0; i < row.length; i++) {
                
                const cell = row[i];

                if (cell === '0') continue;
                
                this.ctx.fillStyle = getColorByValue(cell);
                this.ctx.fillRect(posX + (i * coef), posY + (j * coef), 1 * coef, 1 * coef);
            }
        }
    }

    renderAsteroids = () => {
        this.asteroids.forEach(({ x, y }) => {
            if (x > -60)
                this.renderAsteroid(x, y, 3);
        });
    }

    moveAsteroids = () => {
        this.asteroids = this.asteroids.map(({ x, y }) => {
            if (x > -60) 
                return { x: x - 2, y };
            return { x: this.sceneWidth + 60, y };
        });

        this.renderAsteroids();
    }
}