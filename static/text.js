class CanvasText {
    constructor ({ x, y, height }, string, color) {
        this.x = x + height/3;
        this.y = y + height;
        this.height = height;
        this.string = string;
        this.color = color;
    }

    draw(context, scale) {
        const { x, y, height, string, color } = this;

        const sX = x * scale;
        const sY = y * scale;
        const sHeight = Math.floor(height * scale);

        context.font = `${sHeight}px Arial`;
        context.fillStyle = color;

        context.fillText(string, sX, sY);
    }
}