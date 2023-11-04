import { getColorByValue } from './utils/getColorByValue';

export class StarshipRenderer {
    constructor(ctx, template, startX, startY) {
        this.ctx = ctx;
        this.template = template;
        this.startX = startX;
        this.startY = startY;

        this.render(startX, startY);
    }

    render = (posX, posY, coef = 2, tick = 1) => {
        for (let j = 0; j < this.template.length; j++) {
            const row = this.template[j];

            for (let i = 0; i < row.length; i++) {
                const cell = row[i];

                if (cell === '0') continue;

                this.ctx.fillStyle = getColorByValue(cell);
                this.ctx.fillRect(posX + (i * coef), posY + (j * coef), 1 * coef, 1 * coef);
            }
        }
    }
}