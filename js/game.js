;(function(){
    var Game = function(canvasId){
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext("2d");
        var gameSize = {
            x: canvas.width,
            y: canvas.height
        };

        this.bodies = createInvaders(this).concat([new Player(this, gameSize)]);

        var self = this;

        loadSound("shoot.wav", function(shootSound){
            self.shootSound = shootSound;
            var tick = function(){
                self.update();
                self.draw(screen, gameSize);
                requestAnimationFrame(tick)
            };
            tick();
        });
    }

    Game.prototype = {
        update: function(gameSize){
            var bodies = this.bodies;

            var notCollidingWithAnything = function(b1){
                return bodies.filter(function(b2){
                    return colliding(b1, b2);
                }).length == 0;
            };

            this.bodies = this.bodies.filter(notCollidingWithAnything);

            for(var i = 0; i < this.bodies.length; i ++){
                if(this.bodies[i].position.y < 0){
                    this.bodies.splice(i, 1);
                }
            }
            for(var i = 0; i < this.bodies.length; i ++){
                this.bodies[i].update();
            }
        },

        draw: function(screen, gameSize){
            clearCanvas(screen, gameSize);
            for(var i = 0; i < this.bodies.length; i++){
                drawRect(screen, this.bodies[i]);
            }
        },

        addBody: function(body){
            this.bodies.push(body);
        },

        invadersBelow: function(invader){
            return this.bodies.filter(function(b){
                return b instanceof Invader &&
                    b.position.y > invader.position.y &&
                    b.position.x - invader.position.x < invader.size.width;
            }).length > 0;
        }
    };

    var Invader = function(game, position){
        this.game = game;
        this.size = {width: 16, height: 16};
        this.position = position;
        this.patrolX = 0;
        this.speedX = 0.9;
    };

    Invader.prototype = {
        update: function(){
            if(this.patrolX < 0 || this.patrolX > 500){
                this.speedX = - this.speedX;
            }

            this.position.x += this.speedX;
            this.patrolX += this.speedX;

            if(Math.random() < 0.01 && !this.game.invadersBelow(this)){
                var bullet = new Bullet({
                    x: this.position.x + this.size.width / 2 - 3 / 2,
                    y: this.position.y + this.size.height
                }, {
                    x: Math.random()-0.5,
                    y: 2
                });
                this.game.addBody(bullet);
            }
        }
    };

    var Player = function(game, gameSize){
        this.game = game;
        this.bullets = 0;
        this.timer = 0;
        this.size = {width: 16, height: 16};
        this.position = {
            x: gameSize.x/2-this.size.width/2,
            y: gameSize.y/2-this.size.height/2
        };
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {
        update: function(){
            if(this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)){
                this.position.x -= 2;
            }

            if(this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)){
                this.position.x += 2;
            }

            if(this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)){
                if(this.bullets < 5) {
                    var bullet = new Bullet({
                        x: this.position.x + this.size.width / 2 - 3 / 2,
                        y: this.position.y - 4
                    }, {
                        x: 0,
                        y: -6
                    });

                    this.game.addBody(bullet);
                    this.bullets++;

                    this.game.shootSound.load();
                    this.game.shootSound.play();
                }
            }
            this.timer++;
            if(this.timer % 12 == 0){
                this.bullets = 0;
            }
        }
    };

    var Bullet = function(position, velocity){
        this.size = {width: 3, height: 3};
        this.position = position;
        this.velocity = velocity;
    };

    Bullet.prototype = {
        update: function(){
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    };

    var Keyboarder = function(){
        var keyState = {};

        window.onkeydown = function(event){
            keyState[event.keyCode] = true;
        };

        window.onkeyup = function(event){
            keyState[event.keyCode] = false;
        };

        this.isDown = function(keyCode){
            return keyState[keyCode] === true;
        };

        this.KEYS = {LEFT: 37, RIGHT: 39, SPACE: 32};
    };

    var createInvaders = function(game){
        var invaders = [];
        for(var i = 0; i < 24; i++){
            var x = 30 + (i%8) * 30;
            var y = 30 + (i%3) * 30;
            invaders.push(new Invader(game, {x:x, y:y}));
        }
        return invaders;
    };

    var colliding = function(b1, b2){
        return (b1 != b2 &&
            b1.position.x < b2.position.x + b2.size.width &&
            b1.position.x + b1.size.width > b2.position.x &&
            b1.position.y < b2.position.y + b2.size.height &&
            b1.position.y + b1.size.height > b2.position.y
        );
    };

    var loadSound = function(url, callback){
        var loaded = function(){
            callback(sound);
            sound.removeEventListener("canplaythrough", loaded);
        }
        var sound = new Audio(url);
        sound.addEventListener("canplaythrough", loaded);
        sound.load();
    };

    var drawRect = function(screen, body){
        screen.fillRect(body.position.x, body.position.y, body.size.width, body.size.height);
    };

    var clearCanvas = function(screen, gameSize){
        screen.clearRect(0, 0, gameSize.x, gameSize.y);
    };

    window.onload = function(){
        new Game("screen");
    }
})();