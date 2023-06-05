class GridSquare {
    static colors = {
        [1]: "rgb(1, 0, 250)",
        [2]: "rgb(0, 127, 4)",
        [3]: "rgb(244, 4, 0)",
        [4]: "rgb(1, 0, 128)",
        [5]: "rgb(130, 0, 0)",
        [6]: "rgb(0, 128, 127)",
        [7]: "rgb(0, 0, 0)",
        [8]: "rgb(128, 128, 128)"
    }

    constructor(x, y, size, gridX, gridY) {
        this.square = new Square(x, y, size, "rgb(215, 215, 215)");
        this.text = new CanvasText({ x, y, height: size - 0.01 }, "", "");

        this.adjacentSquares = [];

        this.mine = false; 
        this.revealed = false;
        this.flagged = false;
        this.gridX = gridX;
        this.gridY = gridY;
        this.enemy;
    }

    draw(context, scale) {
        if (this.flagged) {
            this.color = "rgb(255, 0, 0)";
        } else if (this.revealed) {
            if (this.mine) {
                this.color = "rgb(0, 0, 0)";
            } else {
                this.color = "rgb(150, 150, 150)";
            }
        } else {
            this.color = "rgb(215, 215, 215)";
        }

        this.square.draw(context, scale);

        if (this.revealed && !this.mine) {
            const { adjacentMines } = this;
            const { length } = adjacentMines;

            if (length) {
                const color = GridSquare.colors[length];

                this.text.color = color;
                this.text.string = length;

                this.text.draw(context, scale);
            }
        }
    }

    adjacent(condition) {
        return this.adjacentSquares.filter(square => {
            return square[condition];
        });
    }

    get adjacentMines() {
        return this.adjacent("mine");
    }

    get adjacentFlags() {
        return this.adjacent("flagged");
    }

    clickAdjacent(x, y, event) {
        this.adjacentSquares.forEach(square => {
            if (!square.flagged) {
                square.reveal(x, y, event);
            }
        });
    }

    onClick(x, y, event) {
        const { adjacentMines, adjacentFlags } = this;

        if (this.revealed && adjacentMines.length == adjacentFlags.length) {
            this.clickAdjacent(x, y, event);
        }
        

        if (event.which == 1) {
            this.reveal();
        } else if (event.which == 3) {
            if (this.revealed) return;
            this.flagged = !this.flagged;
        }
        
        // this.color = event.which == 1 ? "rgb(150, 150, 150)" : "rgb(255, 0, 0)";
    }

    reveal(x, y, event) {
        if (this.revealed || this.flagged) return;

        this.revealed = true;

        if (this.mine) {
            if (!this.grid) return;
            this.grid.lost = true;
            // setTimeout(_ => {
            //     if (!this.grid) return;
            //     this.grid.reset();
            // }, 1000);
            return;
        }

        if (this.enemy) {
            enemies.push(this.enemy);
            this.enemy = undefined;
        }

        const { length } = this.adjacentMines;

        if (!length) {
            this.clickAdjacent(x, y, event);
        }
    }

    get x() {
        return this.square.x;
    }

    get y() {
        return this.square.y;
    }

    get color() {
        return this.square.color;
    }

    set color(color) {
        this.square.color = color;
    }
}