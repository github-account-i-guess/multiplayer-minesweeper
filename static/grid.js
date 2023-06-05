class Grid {
    // static density = 99 / (16 * 30);
    // static density = 75 / (16* 30);
    static mode = "normal";
    static get density() {
        const expertGridSize = (16 * 30);
        const { mode } = this;
        const numerator = mode == "normal" ? 75 : mode == "weird" ? 150 : 99;
        return numerator / expertGridSize; 
    } 
    static gridSize = 15;

    static gridArea = this.gridSize ** 2;

    static get mineAmount () {
        return Math.round(this.density * this.gridArea);
    } 


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
            const matchesX = s.gridX == x;//abs(x - s.x) < 1/gridSize;
            const matchesY = s.gridY == y;//abs(y - s.y) < 1/gridSize;
            return matchesX && matchesY;
        });

        if (!square) return;
        if (!this.populated && e.which == 1) {
            this.populateGrid(square);
            if (Grid.mode == "normal") {
                square.onClick(x, y, e);
            }
        } else {
            square.onClick(x, y, e);
        };

        if (this.completed) {
            const square = new Square(0, 0, 1, "rgba(0, 255, 0, 0.5)");
            animations.push(new Animation((context, scale, time) => {
                square.draw(context, scale);
            }, 60));
            console.log("completed");
        }
    }

    populateGrid(safeSquare) {
        const { adjacentSquares } = safeSquare;
        const { mode, mineAmount } = Grid;
        const safeSquares = mode == "weird" ? [] : [safeSquare, ...adjacentSquares];
        const squares = this.squares.filter(square => {
            return !safeSquares.includes(square);
        });

        const { floor, random } = Math;

        new Array(mineAmount).fill().forEach(_ => {
            const { length } = squares;
            const index = floor(random() * length);

            const square = squares[index];
            square.mine = true;

            squares.splice(index, 1);
        });

        if (mode == "weird") {
            const normalSquares = this.squares.filter(s => {
                return !s.mine && s.adjacentMines.length && random() < 1/2;
            });
    
            normalSquares.forEach(s => {
                s.onClick(0, 0, { which: 1 });
            });
        }

        safeSquare.mine = false;
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
        }).length;
    }

    get unflaggedMines() {
        return this.mines - this.flagged;
    }

    get hiddenEnemies() {
        return this.squares.filter(s => s.enemy);
    }
}