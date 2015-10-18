//global constants
var RIGHTOFCANVAS = 505 + 50,
    LEFTOFCANVAS = -100,
    ENEMYSPEED = 66;

//console.log(Engine.ctx);


//random movement helper function. Code from: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min);
};

// Enemies our player must avoid
var Enemy = function(y) {
    // Variables applied to each of our instances go here
    this.movement = getRandomArbitrary(3, 5); //select random movement speed for instanstiated enemy object 
    this.x = LEFTOFCANVAS;
    this.y = y;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.movement * dt * ENEMYSPEED; 
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (this.x < RIGHTOFCANVAS) { //505px is the width of the canvas. Add 50px so that the enemy passes the screen and more, thus allowing some time before respawning on the left
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
    }
    else {
        this.movement = getRandomArbitrary(3, 5); //when an enemy reaches the canvas's "virtual" right hand side, it's movement must be randomly adjusted before it respawns. 
        this.x = LEFTOFCANVAS;
    };
    
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//since there is only one player, no prototype property will be utilised

var player = function() {
    
    var PLAYERHORIZONTALVELOCITY = 100,
        PLAYERVERTICLEVELOCITY = 82;
    var playerUp = -1 * PLAYERVERTICLEVELOCITY,
        playerDown = PLAYERVERTICLEVELOCITY,
        playerRight = PLAYERHORIZONTALVELOCITY,
        playerLeft = -1 * PLAYERHORIZONTALVELOCITY;

    this.sprite = 'images/char-boy.png';
    this.movement = [0, 0]; //declare and initialize player(this).movement array. 0 index is horizontal and  1 index is verticle
    this.x = 218; // initialize player start x co-ord
    this.y = 460; // initialize player start y co-ord
    
    this.update = function() {
        console.log(this.x, this.y);
        console.log(this.movement[0]);
        
       
                this.x += this.movement[0];
                
                this.movement[0] = 0; //reset movement[0] Z vector after each frame update

                this.y += this.movement[1];
                
                this.movement[1] = 0; //reset movement[1] Y vector after each frame update
    };

    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.fillRect(0, 400, 10, 10);
    };

    this.handleInput = function(keyCode) {
        

        if (keyCode == 'left') { // left movement on keyup
            
            if (this.x + playerLeft > 0) {

                this.movement[0] += playerLeft;
                this.playerMovement = 'left';
                //console.log('hello');

            };
          
        }

        else if (keyCode == 'right') { // right movement on keyup

            if (this.x + playerRight < window.canvas.width) {

                this.movement[0] += playerRight;
                this.playerMovement = 'right';

            };

        }

        else if (keyCode == 'up') { // up movement on keyup

            if (this.y + playerUp > 0) {

                this.movement[1] += playerUp;
                this.playerMovement = 'up';

            };
            
        }

        else if (keyCode == 'down') { // down movement on keyup

            if (this.y + playerDown < window.canvas.height - PLAYERVERTICLEVELOCITY) {

                this.movement[1] += playerDown;
                this.playerMovement = 'down';

            };
            
        };
    };
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// ---
// Y-corindates for the three enermy lanes: 50, 200, 350
//
//
var allEnemies = [];

var enemyOne = new Enemy(55);
var enemyTwo = new Enemy(140);
var enemyThree = new Enemy(220);

allEnemies[0] = enemyOne;
allEnemies[1] = enemyTwo;
allEnemies[2] = enemyThree;

var player = new player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
