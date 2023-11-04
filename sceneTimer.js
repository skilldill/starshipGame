
/**
 * 
 * @param {*} renderFns (ctx, currentTick) => void;
 * @param {*} ctx canvas ctx
 * @param {*} tick current tick time
 */
export function getSceneTimer(
    renderFns, 
    ctx,
    getTickState, 
    tick = 100,
) {
    let start = 0;

    function sceneTimer(timeStamp = 0) {
        const delta = timeStamp - start;

        const state = getTickState();
        
        if (delta >= tick) {
           renderFns.forEach((fn) => fn(ctx, state));
        }

        requestAnimationFrame(sceneTimer);
    }

    return sceneTimer;
}