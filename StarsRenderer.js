import { getRandomInt } from "./utils/getRandomInt";

export class StarsRenderer {
    stars = [];

    constructor(ctx, sceneWidth, sceneHeight) {
        this.ctx = ctx;
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        this.generateStars();
        this.renderStars();
    }

    generateStars = () => {
        for (let i = 0; i < this.sceneWidth; i += 2) {
            for (let j = 0; j < this.sceneWidth; j += 2) {
                const random = getRandomInt(100);
                if (random === 100 || random === 10) {
                    this.stars.push({ x: i, y: j });
                }
            }
        }
    }

    renderStars = () => {
        this.ctx.fillStyle = '#fff';

        this.stars.forEach((star) => {
            this.ctx.fillRect(star.x, star.y, 1, 1);
        });
    }

    moveStars = () => {
        this.stars = this.stars.map((star) => {
            const updatedX = star.x - 1;
            if (updatedX < 0) return { ...star, x: this.sceneWidth };
            return { ...star, x: updatedX };
        });

        this.renderStars();
    }
}