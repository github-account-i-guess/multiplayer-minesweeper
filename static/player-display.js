class PlayerDisplay {
    static createElement(name, classes, innerHTML) {
        const element = document.createElement(name);
        element.classList.add(...classes);
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static rowify(element) {
        const row = PlayerDisplay.createElement("div", ["row"]);

        row.append(element);

        return row;
    }

    constructor(container, player) {
        const { grid, name } = player;
        this.container = container;
        this.grid = player.grid;
        this.name = player.name;
        this.player = player;

        this.build();
    }

    build() {
        const { createElement } = PlayerDisplay;

        this.col = createElement("div", ["col-6"]);

        this.containerFluid = createElement("div", ["container-fluid"]);

        this.title = createElement("p", ["text-center", "fs-5"], this.name);

        this.mineCounter = createElement("p", ["text-center"], `Mines: ${this.grid.mines}`);

        this.progressCounter = createElement("p", ["text-center"], `Progress: None`);

        this.completedGrids = createElement("p", ["text-center"], `Completed: None`);

        this.livesCounter = createElement("p", ["text-center"], `Lives: ${Player.startingLives}`);

        this.containerFluid.append(...[
            this.title,
            this.livesCounter,
            this.mineCounter,
            this.progressCounter,
            this.completedGrids,
        ].map(PlayerDisplay.rowify));

        this.col.append(this.containerFluid);

        this.container.append(this.col);
    }

    update() {
        const { mineCounter, grid, progressCounter, completedGrids, livesCounter } = this;
        const { unflaggedMines, progress, mines } = grid;
        let { completed, lives } = this.player

        livesCounter.innerHTML = `Lives: ${lives}`;
        mineCounter.innerHTML = `Mines: ${unflaggedMines}`;
        progressCounter.innerHTML = `Progress ${progress}/${Grid.gridArea - mines}`;
        if (grid.completed) completed ++;
        completedGrids.innerHTML = `Completed: ${completed}`;
    }
}