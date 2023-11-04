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
const sceneCanvas = document.getElementById('gameScene');
const sceneCtx = sceneCanvas.getContext('2d');

sceneCanvas.addEventListener('click', () => {
    keyboardController.focus();
});

function clearScene(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
}

let state = {
    posX: 100,
    posY: 200,
    pressedHorizontalKey: '', 
    pressedVerticalKey: '',
}

function getState() {
    switch(state.pressedVerticalKey) {
        case 'ArrowDown':
            state = { ...state, posY: state.posY + 8 }
            break;

        case 'ArrowUp':
            state = { ...state, posY: state.posY - 8 }
            break;
    }

    switch(state.pressedHorizontalKey) {
        case 'ArrowRight':
            state = { ...state, posX: state.posX + 3 }
            break;

        case 'ArrowLeft':
            state = { ...state, posX: state.posX - 3 }
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
    const hpController = new HPController(sceneCtx, 100, SCENE_WIDTH, SCENE_HEIGHT);

    const keydownActionsMap = {
        ArrowUp: () => {
            state = { ...state, pressedVerticalKey: 'ArrowUp' }
        },
        ArrowDown: () => {
            state = { ...state, pressedVerticalKey: 'ArrowDown' }
        },
        ArrowLeft: () => {
            state = { ...state, pressedHorizontalKey: 'ArrowLeft' }
        },
        ArrowRight: () => {
            state = { ...state, pressedHorizontalKey: 'ArrowRight' }
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
            state = { ...state, pressedVerticalKey: '' }
        },
        ArrowDown: () => {
            state = { ...state, pressedVerticalKey: '' }
        },
        ArrowLeft: () => {
            state = { ...state, pressedHorizontalKey: '' }
        },
        ArrowRight: () => {
            state = { ...state, pressedHorizontalKey: '' }
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
            return true;
        }
        return false;
    }

    const handleEndAsteroid = () => {
        hpController.downHP(2);
    }

    const rendesFns = [
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

    const sceneTimer = getSceneTimer(rendesFns, sceneCtx, getState, 100);

    sceneTimer();
}