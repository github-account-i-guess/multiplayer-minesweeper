class Player extends Entity {
    static startingLives = 3;
    static startingHealth = 100;

    completed = 0;
    sendableMines = 0;
    lives = Player.startingLives;
    constructor(name, grid) {
        super(7, 7, "orange");
        this.name = name;
        this.grid = grid;
        this.health = Player.startingHealth;
    }

    // get serverInfo() {
    //     const { completed, sendableMines, lives, grid } = this;
    //     const { serverGrid } = grid;
    //     return { completed, sendableMines, lives, grid: serverGrid };
    // }

    // set serverInfo(info) {
    //     const { completed, sendableMines, lives, grid } = info;
    //     this.completed = completed;
    //     this.sendableMines = sendableMines;
    //     this.lives = lives;
    //     this.grid.serverGrid = grid;
    // }

    reset(grid) {
        this.completed = 0;
        this.sendableMines = 0;
        this.lives = Player.startingLives;
    }
}
