class Square {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw(context, scale) {
        const { x, y, size, color } = this;

        const scaledX = scale * x;
        const scaledY = scale * y;
        const scaledSize = scale * size;

        context.fillStyle = color;
        context.fillRect(scaledX, scaledY, scaledSize, scaledSize);
    }
}