class Entity {
    static squareSpaces = 10;
    _squareX = Entity.squareSpaces/2;
    _squareY = Entity.squareSpaces/2;

    constructor(x, y, color) {
        this._gridX = x;
        this._gridY = y;
        this.square = new Square(this.x, this.y, (1/gridSize)/Player.squareSpaces, color);
    }

    draw(context, scale) {
        this.square.draw(context, scale);
    }

    get gridX() {
        return this._gridX;
    }

    get gridY() {
        return this._gridY;
    }

    get squareX() {
        return this._squareX;
    }

    get squareY() {
        return this._squareY;
    }

    set squareX(value) {
        const { squareSpaces } = Player;
        if (value < 0 || value >= squareSpaces) {
            const gridXOffset = Math.floor(value/squareSpaces);
            this._squareX = (Math.sign(value) * (Math.abs(value) % squareSpaces) + squareSpaces) % squareSpaces;
            this._gridX += gridXOffset;
        } else this._squareX = value;

        this.square.x = this.x;
    }

    set squareY(value) {
        const { squareSpaces } = Player;
        if (value < 0 || value >= squareSpaces) {
            const gridYOffset = Math.floor(value/squareSpaces);
            this._squareY = (Math.sign(value) * (Math.abs(value) % squareSpaces) + squareSpaces) % squareSpaces;
            this._gridY += gridYOffset;
        } else this._squareY = value;

        this.square.y = this.y;
    }

    set gridX(value) {
        this._gridX = value;
        this.square.x = this.x;
    }

    set gridY(value) {
        this._gridY = value;
        this.square.y = this.y;
    }

    get x() {
        const { squareSpaces } = Player;    
        const gridSquareSize = 1/gridSize;
        return this.gridX * gridSquareSize + this.squareX * gridSquareSize/squareSpaces;
    }

    get y() {
        const { squareSpaces } = Player;
        const gridSquareSize = 1/gridSize;
        return this.gridY * gridSquareSize + this.squareY * gridSquareSize/squareSpaces;
    }

    get currentSquare() {
        const { squares } = this.grid;
        return squares.find(s => {
            return s.gridX == this.gridX &&
                s.gridY == this.gridY;
        });
    }
}