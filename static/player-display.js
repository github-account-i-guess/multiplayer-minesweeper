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

    constructor(container, grid, name) {
        this.container = container;
        this.grid = grid;
        this.name = name;

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

        this.containerFluid.append(...[
            this.title,
            this.mineCounter,
            this.progressCounter,
            this.completedGrids,
        ].map(PlayerDisplay.rowify));

        this.col.append(this.containerFluid);

        this.container.append(this.col);
    }

    update(completed, sendableMines) {
        this.mineCounter.innerHTML = `Mines: ${this.grid.mines}`;
        this.progressCounter.innerHTML = `Progress ${this.grid.progress}/${Grid.gridArea}`;
        if (this.grid.completed) completed ++;
        this.completedGrids.innerHTML = `Completed: ${completed}`;
    }
}