function attackAnimation(entity, range, color) {
    const { size: entitySize } = entity.square;
    const animationTime = 30;
    const animation = new Animation((context, scale, time) => {
        const size = range * 2 * time/30;
        const x = entity.x - size/2 + entitySize/2;
        const y = entity.y - size/2 + entitySize/2;

        const square = new Square(x, y, size, color);
        square.draw(context, scale);
    }, animationTime)
    animations.push(animation);
}


function enemiesInRange(range) {
    return enemies.filter(e => {
        return Enemy.checkRange(e, player, range);
    });
}

function attack(range, damage, color, aoe) {
    const inRange = enemiesInRange(range).sort((a, b) => {
        return a.health - b.health;
    });
    attackAnimation(player, range, color);

    if (aoe) {
        inRange.forEach(e => {
            e.health -= damage;
        })
    } else {
        const enemy = inRange[0];
        if (enemy) {
            enemy.health -= damage;
        } 
    }
}

class Ability {
    static abilities = {
        aoeThingy: new Ability(player => {
            attack(0.05, 1, "rgba(30, 30, 255, 0.5)", true);
        }),
        berserkerThingy: new Ability(player => {
            const { health } = player;
            const damage = (100 - health)/10;
            attack(0.01, damage, "rgba(100, 0, 0, 0.9)", false);
        }),
        tacticalNuke: new Ability(player => {
            if (player.health >= 50) {
                attack(1, 100, "rgba(0, 0, 0, 0.5)", true);
                player.health = 1;
            }
        }),
        heal: new Ability(player => {
            const { mines } = player;
            if (mines >= 5) {
                player.mines -= 5;
                player.health += 5;
            } else {
                player.health += mines;
                player.mines = 0;
            }
        }),
    }
    
    constructor(action) {
        this.action = action;
    }

    activate(player) {
        this.action(player);
    }
}