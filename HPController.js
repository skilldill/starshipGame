import { getPercent } from "./utils/getPercent";

export class HPController {
    constructor(ctx, hp, sceneWidth, sceneHeight, onGameOver) {
        this.ctx = ctx;
        this.maxHP = hp;
        this.currentHP = hp;
        this.sceneHeight = sceneHeight;
        this.sceneWidth = sceneWidth;
        this.renderHP();
        this.onGameOver = onGameOver
    }

    renderHP = () => {
        const percentHP = getPercent(this.maxHP, this.currentHP);

        if (percentHP > 33)
            this.ctx.fillStyle = 'orange';
        if (percentHP > 66)
            this.ctx.fillStyle = 'green';
        if (percentHP < 33)
            this.ctx.fillStyle = 'red';

        this.ctx.fillRect(this.sceneWidth - 250, this.sceneHeight - 70, this.currentHP * 2, 20);
    }

    downHP = (damageValue = 1) => {
        this.currentHP -= damageValue;

        if (this.currentHP <= 0)
            return this.onGameOver();

        if (this.currentHP > 0)
            this.renderHP();
    }
}
