const gameCanvas = document.querySelector("#game-canvas");
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

const playerGrid = new Grid(0, 0, 1, "rgb(100, 100, 255)", getSquares(0));
const opponentGrid = new Grid(1, 0, 1, "rgb(255, 100, 100)", getSquares(1));

let resizing = false;
function adjustCanvasToScreen() {
    resizing = true;
    const smallerDimension = Math.min(innerWidth/2, innerHeight);
    gameCanvas.width = smallerDimension * 2;
    gameCanvas.height = smallerDimension;
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

gameCanvas.oncontextmenu = _ => false;

// const grids = [playerGrid, opponentGrid];
setInterval(_ => {
    if (resizing) return;

    const { width, height } = gameCanvas;

    gameContext.clearRect(0, 0, width, height);

    playerGrid.draw(gameContext, height);
    opponentGrid.draw(gameContext, height);
}, 1000/60);


setInterval(_ => {
    resizing = false;
}, 200);