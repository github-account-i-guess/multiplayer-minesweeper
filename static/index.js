const gameCanvas = document.querySelector("#game-canvas");
const infoDiv = document.querySelector("#info-div")
const playerDisplaysContainer = document.querySelector("#player-displays-container");
const gameContext = gameCanvas.getContext("2d");

const { gridSize } = Grid;

function getSquares(offset){
    const squares = Grid.emptyArray.map((_, y) => {
        return Grid.emptyArray.map((_, x) => {
            const margin = 1/100;
            const hMargin = margin/2;
            return new GridSquare(x/gridSize + hMargin + offset, y/gridSize + hMargin, 1/gridSize - margin);
        });
    }).flat();

    const length3Array = _ => new Array(3).fill();

    squares.forEach((square, squareIndex) => {
        const adjacent = length3Array().map((_, i) => {
            return length3Array().map((_, j) => {
                const dx = i - 1;
                const dy = j - 1;
                const indexOffset = gridSize * dy + dx;
                const index = squareIndex + indexOffset;

                const newY = Math.floor(index/gridSize);
                const predictedY = Math.floor(squareIndex/gridSize) + dy;

                const wraparound = newY != predictedY;

                if (wraparound) return [];

                const adjacentSquare = squares[index];
                if (adjacentSquare == square) return [];
                return adjacentSquare || [];
            });
        });

        square.adjacentSquares = adjacent.flat(Infinity);
    });

    return squares;
}

const otherPlayerScale = 0.5;
const otherPlayerOffset = 1/otherPlayerScale;

const playerGrid = new Grid(0, 0, 1, "rgb(100, 100, 255)", getSquares(0));
const opponentGrid = new Grid(otherPlayerOffset, 0, 1, "rgb(255, 100, 100)", getSquares(otherPlayerOffset));

const playerDisplay = new PlayerDisplay(playerDisplaysContainer, playerGrid, "You");
const opponentDisplay = new PlayerDisplay(playerDisplaysContainer, opponentGrid, "Opponent");

let resizing = false;
function adjustCanvasToScreen() {
    resizing = true;
    const aspectRatio = 1 + otherPlayerScale;
    const smallerDimension = Math.min(innerWidth/aspectRatio, innerHeight);
    gameCanvas.width = smallerDimension * aspectRatio;
    gameCanvas.height = smallerDimension;

    const { style } = infoDiv;
    style.top = otherPlayerScale * gameCanvas.height + "px";
    style.left = innerWidth/aspectRatio + "px";
    style.width = innerWidth * (1 - 1/aspectRatio) + 'px';
}

adjustCanvasToScreen();
window.addEventListener("resize", adjustCanvasToScreen);

gameCanvas.addEventListener("mousedown", event => {
    const { pageX, pageY } = event;
    const { width, height } = gameCanvas;

    const scaledX = pageX/height;
    const scaledY = pageY/height;

    // const grid = scaledX <= 1 ? playerGrid : opponentGrid;
    // grid.onClick(scaledX, scaledY, event);
    if (scaledX <= 1) playerGrid.onClick(scaledX, scaledY, event);
});

document.addEventListener("keydown", event => {
    try { event.key.toLowerCase() } catch { return }

    const key = event.key.toLowerCase();

    if (key == 'tab') {
        playerGrid.reset();
    }
});

gameCanvas.oncontextmenu = _ => false;

// const grids = [playerGrid, opponentGrid];
setInterval(_ => {
    if (resizing) return;

    const { width, height } = gameCanvas;

    gameContext.clearRect(0, 0, width, height);

    playerGrid.draw(gameContext, height);
    opponentGrid.draw(gameContext, height * otherPlayerScale);

    playerDisplay.update();
    opponentDisplay.update();
}, 1000/60);


setInterval(_ => {
    resizing = false;
}, 200);