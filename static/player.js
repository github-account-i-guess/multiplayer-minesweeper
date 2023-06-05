class Player extends Entity {
    static startingHealth = 100;

    completed = 0;
    mines = 0;
    constructor(name, grid) {
        super(7, 7, "orange");
        this.name = name;
        this.grid = grid;
        this.health = Player.startingHealth;
    }

    // get serverInfo() {
    //     const { completed, mines, lives, grid } = this;
    //     const { serverGrid } = grid;
    //     return { completed, mines, lives, grid: serverGrid };
    // }

    // set serverInfo(info) {
    //     const { completed, mines, lives, grid } = info;
    //     this.completed = completed;
    //     this.mines = mines;
    //     this.lives = lives;
    //     this.grid.serverGrid = grid;
    // }

    reset(grid) {
        this.completed = 0;
        this.mines = 0;
        this.lives = Player.startingLives;
    }
}
