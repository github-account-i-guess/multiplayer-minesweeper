const gameCanvas = document.querySelector("#game-canvas");
const infoDiv = document.querySelector("#info-div");
const mainMenu = document.querySelector("#main-menu");
const startGameButton = document.querySelector("#start-game-button");

const playerDisplaysContainer = document.querySelector("#player-displays-container");
const gameContext = gameCanvas.getContext("2d");

const { gridSize } = Grid;
const margin = 1/100;
const gridSquareSize = 1/gridSize - margin;

function getSquares(offset) {
    const squares = Grid.emptyArray.map((_, y) => {
        return Grid.emptyArray.map((_, x) => {
            const hMargin = margin/2;
            return new GridSquare(x/gridSize + hMargin + offset, y/gridSize + hMargin, gridSquareSize, x, y);
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
const player = new Player("You", playerGrid);
const playerDisplay = new PlayerDisplay(playerDisplaysContainer, player);

let completedGrids = 0;

let resizing = false;
function adjustCanvasToScreen() {
    resizing = true;
    const aspectRatio = 1 + otherPlayerScale;
    const smallerDimension = Math.min(innerWidth/aspectRatio, innerHeight);
    gameCanvas.width = smallerDimension * aspectRatio;
    gameCanvas.height = smallerDimension;

    const { style } = infoDiv;
    style.top = otherPlayerScale * gameCanvas.height + "px";
    style.left = gameCanvas.width/aspectRatio + "px";
    style.width = gameCanvas.width * (1 - 1/aspectRatio) + 'px';

    mainMenu.style.top = "0px";
    mainMenu.style.left = style.left;
    mainMenu.style.width = style.width;
}

adjustCanvasToScreen();
window.addEventListener("resize", adjustCanvasToScreen);

// gameCanvas.addEventListener("mousedown", event => {
//     const { pageX, pageY } = event;
//     const { width, height } = gameCanvas;

//     const scaledX = pageX/height;
//     const scaledY = pageY/height;
//     if (scaledX <= 1) playerGrid.onClick(scaledX, scaledY, event);
// });

function simulateClick(x, y, which) {
    playerGrid.onClick(x, y, { which });
}

const keysPressed = {};

document.addEventListener("keydown", event => {
    try { event.key.toLowerCase() } catch { return }

    const key = event.key.toLowerCase();
    keysPressed[key] = true;
});

const enemies = [];
function randomCoordinate() {
    return Math.random() * Grid.gridSize;
}

function spawnEnemies(amount) {
    for (i = 0; i < amount; i ++) {
        const randX = randomCoordinate();
        const randY = randomCoordinate();
        const health = Math.round(10 + 10 * Math.random());
        enemies.push(new Enemy(randX, randY, health, 0.03, Enemy.standardMove, Enemy.standardAttack, "red"));
    }
} 

function nextLevel() {
    if (playerGrid.completed) {
        player.completed ++;
        player.sendableMines += playerGrid.mines;
    } else {
        player.lives --;

        const { flagged, incorrectlyFlagged } = playerGrid;
        player.sendableMines += flagged - incorrectlyFlagged * 2;
        if (player.lives <= 0) {
            gameEnd("lost")
        }
    }
    enemies.splice(0);
    spawnEnemies(1 + player.completed);
    playerGrid.reset();
};

function enemiesInRange(range) {
    return enemies.filter(e => {
        return Enemy.checkRange(e, player, range);
    });
}

document.addEventListener("keyup", event => {
    try { event.key.toLowerCase() } catch { return }

    const key = event.key.toLowerCase();
    keysPressed[key] = false;
    switch(key) {
        case "`":
            event.preventDefault();
            nextLevel();
            break;
        case "enter":
            simulateClick(player.gridX, player.gridY, 1);
            break;
        case "shift":
            simulateClick(player.gridX, player.gridY, 3);
            break;
        case "1":
            const inRange = enemiesInRange(0.05);
            inRange.forEach(enemy => {
                enemy.health --;
            });
        default:
            break;

    }
});

const joinGame = mode => event => {
    Grid.mode = mode;
    mainMenu.classList.add("d-none");
    player.reset();
    enemies.splice(0);
    spawnEnemies(1);
    playerGrid.reset();
}

startGameButton.addEventListener("click", joinGame("normal"));

gameCanvas.oncontextmenu = _ => false;

function boundsCheck(entity) {
    const { gridX, gridY } = entity;
    const gridSize = Grid.gridSize - 1;
    const { squareSpaces } = Entity;
    if (gridX < 0) {
        entity.squareX = 0;
        entity.gridX = 0;
    }
    if (gridX > gridSize) {
        entity.squareX = squareSpaces - 1;
        entity.gridX = gridSize;
    }
    if (gridY < 0) {
        entity.squareY = 0;
        entity.gridY = 0;
    }
    if (gridY > gridSize) {
        entity.squareY = squareSpaces - 1;
        entity.gridY = gridSize;
    }
}

let movementTick = false;
setInterval(_ => {
    if (movementTick) {
        listen("a", _ => player.squareX --);
        listen("d", _ => player.squareX ++);
        listen("w", _ => player.squareY --);
        listen("s", _ => player.squareY ++);
        boundsCheck(player);

        enemies.forEach((enemy, _, array) => {
            enemy.onTick(player);
            boundsCheck(enemy);
            if (enemy.health < 0) {
                const index = array.indexOf(enemy);
                enemies.splice(index);
            }
        });

        if (player.health < 0) {
            nextLevel();
            player.health = Player.startingHealth;
        }
    }
    
    movementTick = !movementTick;

    if (resizing) return;

    const { width, height } = gameCanvas;

    gameContext.clearRect(0, 0, width, height);

    playerGrid.draw(gameContext, height);

    enemies.forEach(enemy => {
        enemy.draw(gameContext, height);
    });

    playerDisplay.update(completedGrids, 0);
    player.draw(gameContext, height);
}, 1000/60);

function listen(key, func) {
    if(keysPressed[key]) func();
}

setInterval(_ => {
    resizing = false;
}, 200);

function gameEnd(type){
    alert("You " + type);
    enemies.splice(0);
    mainMenu.classList.remove("d-none");
}