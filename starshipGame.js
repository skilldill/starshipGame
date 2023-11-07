import { AsteroidsRenderer } from "./AsteroidsRenderer";
import { HPController } from "./HPController";
import { ShotsRenderer } from "./ShotsRenderer";
import { StarsRenderer } from "./StarsRenderer";
import { StarshipRenderer } from "./StarshipRenderer";
import { ASTEROID_DEFAULT } from "./asteroidsTemplate";
import { SCENE_HEIGHT, SCENE_WIDTH } from "./constants";
import { getSceneTimer } from "./sceneTimer";
import { STARSHIP_DEFAULT_TEMPLATE_12X9 } from "./starshipTemplates";

const keyboardController = document.getElementById('controller');
const gameOverBlock = document.getElementById('gameOverBlock');
const restartButton = document.getElementById('restartButton');
const scoresDisplay = document.getElementById('scoresDisplay');
const sceneCanvas = document.getElementById('gameScene');
const sceneCtx = sceneCanvas.getContext('2d');

sceneCanvas.addEventListener('click', () => {
    keyboardController.focus();
});

restartButton.addEventListener('click', () => {
    window.location.reload();
});

function clearScene(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
}

let gameScores = 0;

let state = {
    posX: 100,
    posY: 200,
    pressedHorizontalKey: '', 
    pressedVerticalKey: '',
}

function getState() {
    switch(state.pressedVerticalKey) {
        case 'ArrowDown':
            state.posY += 8;
            break;

        case 'ArrowUp':
            state.posY -= 8;
            break;
    }

    switch(state.pressedHorizontalKey) {
        case 'ArrowRight':
            state.posX += 3;
            break;

        case 'ArrowLeft':
            state.posX -= 3;
            break;
    }

    return state;
}

const getHandleKeydown = (keyToActionMap) => (event) => {
    keyToActionMap[event.code]();
}

const getHandleKeyup = (keyToActionMap) => (event) => {
    keyToActionMap[event.code]?.();
}

const gameOver = () => {
    gameOverBlock.style.opacity = 1;
    sceneCanvas.style.display = 'none';
    scoresDisplay.innerText = `Сбито астеройдов ${gameScores}`;
}

export function initGame() {
    const starsRenderer = new StarsRenderer(sceneCtx, SCENE_WIDTH, SCENE_HEIGHT);
    const shotsRenderer = new ShotsRenderer(sceneCtx, SCENE_WIDTH, SCENE_HEIGHT);
    const starshipRenderer = new StarshipRenderer(
        sceneCtx, 
        STARSHIP_DEFAULT_TEMPLATE_12X9,
        100,
        SCENE_HEIGHT / 2 - (STARSHIP_DEFAULT_TEMPLATE_12X9 - 1) / 2,
    );
    const asteroidsRenderer = new AsteroidsRenderer(
        sceneCtx, 
        ASTEROID_DEFAULT, 
        SCENE_WIDTH, 
        SCENE_HEIGHT
    );
    const hpController = new HPController(
        sceneCtx, 
        100, 
        SCENE_WIDTH, 
        SCENE_HEIGHT, 
        gameOver
    );

    const keydownActionsMap = {
        ArrowUp: () => {
            state.pressedVerticalKey = 'ArrowUp';
        },
        ArrowDown: () => {
            state.pressedVerticalKey = 'ArrowDown';
        },
        ArrowLeft: () => {
            state.pressedHorizontalKey = 'ArrowLeft';
        },
        ArrowRight: () => {
            state.pressedHorizontalKey = 'ArrowRight';
        },
        Space: () => {
            shotsRenderer.addShot(
                state.posX + STARSHIP_DEFAULT_TEMPLATE_12X9[0].length,
                state.posY + 0,
            );
            // shotsRenderer.addShot(
            //     state.posX + STARSHIP_DEFAULT_TEMPLATE_12X9[0].length,
            //     state.posY + 16,
            // );
            shotsRenderer.addShot(
                state.posX + STARSHIP_DEFAULT_TEMPLATE_12X9[0].length,
                state.posY + 30,
            );
        }
    }; 

    const keyupActionsMap = {
        ArrowUp: () => {
            state.pressedVerticalKey = '';
        },
        ArrowDown: () => {
            state.pressedVerticalKey = '';
        },
        ArrowLeft: () => {
            state.pressedHorizontalKey = '';
        },
        ArrowRight: () => {
            state.pressedHorizontalKey = '';
        }
    };

    keyboardController.addEventListener('keydown', getHandleKeydown(keydownActionsMap));
    keyboardController.addEventListener('keyup', getHandleKeyup(keyupActionsMap));

    const handleShot = (shot) => {
        keyboardController.focus();

        const foundAsteroidIndex = asteroidsRenderer.asteroids.findIndex((asteroid) => 
            (shot.x >= asteroid.x && shot.x <= asteroid.x + 100)
            && (shot.y >= asteroid.y && shot.y <= asteroid.y + 40)    
        );
        if (foundAsteroidIndex > -1) {
            asteroidsRenderer.asteroids[foundAsteroidIndex].x = SCENE_WIDTH * 10;
            gameScores += 1;
            return true;
        }
        return false;
    }

    const handleEndAsteroid = () => {
        hpController.downHP(2);
    }

    let rendesFns = [
        clearScene,
        starsRenderer.moveStars,
        (_, currentState) => starshipRenderer.render(
            currentState.posX, 
            currentState.posY,
            3
        ),
        () => shotsRenderer.moveShots(handleShot),
        () => asteroidsRenderer.moveAsteroids(handleEndAsteroid),
        hpController.renderHP
    ];

    const sceneTimer = getSceneTimer(rendesFns, sceneCtx, getState, 10);

    sceneTimer();
}