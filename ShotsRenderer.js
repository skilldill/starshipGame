export class ShotsRenderer {
    shots = [];

    constructor(ctx, sceneWidth, sceneHeight) {
        this.ctx = ctx;
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
    }

    addShot = (posX, posY) => {
        if (posY > 0 && posY < this.sceneHeight && posX < this.sceneWidth)
            this.shots.push({ x: posX, y: posY });
        this.shots.sort((a, b) => {
            return a.y - b.y;
        });
    }

    renderShots = () => {
        this.ctx.fillStyle = 'yellow';

        this.shots.forEach((shot) => {
            if (shot.x < this.sceneWidth)
                this.ctx.fillRect(shot.x, shot.y, 6, 2);
        });
    }

    moveShots = (onShot) => {
        this.shots = this.shots.map((shot) => {
            if (shot.x < this.sceneWidth) {
                const updatedShot = { ...shot, x: shot.x + 12 };
                const shoted = onShot(updatedShot);

                if (shoted)
                    return { ...shot, x: this.sceneWidth + 10 };
                return updatedShot;
            }
            return shot;
        });

        this.renderShots();
    }
}
