const gameCanvas = document.querySelector("#game-canvas");
const gameContext = gameCanvas.getContext("2d");

function adjustCanvasToScreen() {
    const { style } = gameCanvas;
    const smallerDimension = Math.min(innerWidth, innerHeight) + "px";
    style.width = smallerDimension;
    style.height = smallerDimension;
}

adjustCanvasToScreen();
window.addEventListener("resize", adjustCanvasToScreen);

// gameContext.fillRect(0, 0, 1000, 1000);