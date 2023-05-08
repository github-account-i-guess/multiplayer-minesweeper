class Grid {
    // static density = 99 / (16 * 30);
    static density = 75 / (16* 30);
    static gridSize = 15;

    static gridArea = this.gridSize ** 2;

    static mineAmount = Math.round(this.density * this.gridArea);


    static get emptyArray() {
        return new Array(this.gridSize).fill();
    }

    populated = false;
    lost = false;

    constructor(x, y, size, color, squares) {
        this.square = new Square(x, y, size, color);

        squares.forEach(square => {
            square.grid = this;
        });
        this.squares = squares;
    }

    draw(context, scale) {
        this.square.draw(context, scale);
        this.squares.forEach(s => s.draw(context, scale));
    }

    onClick(x, y, e) {
        if (this.lost) return;
        const { abs } = Math;
        const { gridSize } = Grid;
        const square = this.squares.find((s, i) => {
            const matchesX = abs(x - s.x) < 1/gridSize;
            const matchesY = abs(y - s.y) < 1/gridSize;
            return matchesX && matchesY;
        });

        if (!square) return;
        if (!this.populated && e.which == 1) {
            this.populateGrid(square);
        };

        square.onClick(x, y, e);

        if (this.completed) console.log("completed");
    }

    populateGrid(safeSquare) {
        const { adjacentSquares } = safeSquare;
        const safeSquares = [safeSquare, ...adjacentSquares];
        const squares = this.squares.filter(square => {
            return !safeSquares.includes(square);
        });

        const { floor, random } = Math;

        new Array(Grid.mineAmount).fill().forEach(_ => {
            const { length } = squares;
            const index = floor(random() * length);

            const square = squares[index];
            square.mine = true;

            squares.splice(index, 1);
        });

        this.populated = true;
    }

    reset() {
        this.squares.forEach(square => {
            square.flagged = false;
            square.mine = false;
            square.revealed = false;
        });

        this.populated = false;
        this.lost = false;
    }

    amount(condition) {
        return this.squares.filter(square => {
            return square[condition];
        }).length;
    }

    get completed() {
        const { length } = this.squares;
        const completed = this.squares.filter(s => {
            return s.mine || s.revealed;
        });

        return length == completed.length;
    }

    get mines() {
        return this.amount("mine")
    }

    get revealed() {
        return this.amount("revealed");
    }

    get flagged() {
        return this.amount("flagged");
    }

    get incorrectlyFlagged() {
        return this.squares.filter(s => {
            return s.flagged && !s.mine;
        });
    }

    get unflaggedMines() {
        return this.mines - this.flagged;
    }
}