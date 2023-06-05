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
        this.grid = grid;
        this.name = name;
        this.player = player;

        this.build();
    }

    build() {
        const { createElement } = PlayerDisplay;

        this.col = createElement("div", ["col-6"]);

        this.containerFluid = createElement("div", ["container-fluid"]);

        this.title = createElement("p", ["text-center", "fs-5"], this.name);
        const counterClasses = ["text-center"];
        this.healthCounter =  createElement("p", counterClasses);
        this.completedGrids = createElement("p", counterClasses);
        this.mineCounter = createElement("p", counterClasses);
        this.progressCounter = createElement("p", counterClasses);
        this.sendableCounter = createElement("p", counterClasses);


        this.containerFluid.append(...[
            this.title,
            this.healthCounter,
            this.completedGrids,
            this.mineCounter,
            this.progressCounter,
            this.sendableCounter,
        ].map(PlayerDisplay.rowify));

        this.col.append(this.containerFluid);

        this.container.append(this.col);
    }

    update() {
        const { grid, mineCounter, progressCounter, completedGrids, livesCounter, healthCounter, sendableCounter } = this;
        const { unflaggedMines, revealed, mines } = grid;
        let { completed, mines: playerMines, health } = this.player

        healthCounter.innerHTML = `Health: ${Math.round(health)}`;
        if (grid.completed) completed ++;
        completedGrids.innerHTML = `Completed: ${completed}`;
        mineCounter.innerHTML = `Remaining Mines: ${unflaggedMines}`;
        progressCounter.innerHTML = `Progress ${revealed}/${Grid.gridArea - mines}`;
        sendableCounter.innerHTML = `Your Mines: ${playerMines}`;
    }
}