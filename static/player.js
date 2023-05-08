class Player {
    static startingLives = 3;

    completed = 0;
    sendableMines = 0;
    lives = Player.startingLives;

    constructor(name, grid) {
        this.name = name;
        this.grid = grid;
    }

    get serverInfo() {
        const { completed, sendableMines, lives, grid } = this;
        const { serverGrid } = grid;
        return { completed, sendableMines, lives, grid: serverGrid };
    }

    set serverInfo(info) {
        const { completed, sendableMines, lives, grid } = info;
        this.completed = completed;
        this.sendableMines = sendableMines;
        this.lives = lives;
        this.grid.serverGrid = grid;
    }
}