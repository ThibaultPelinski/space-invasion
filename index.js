const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
const scoreEl2 = document.querySelector('#scoreEl2');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor () {

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;
        this.opacity = 1;

        const image = new Image();
        image.src = './img/spaceship.png';
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.positions = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw () {
        // c.fillStyle = '#fff';
        // c.fillRect(this.positions.x, this.positions.y, this.width, this.height); 
            c.save(); 
            c.globalAlpha = this.opacity;
            c.translate(
                player.positions.x + player.width / 2, 
                player.positions.y + player.height / 2
                );

            c.rotate(this.rotation);

            c.translate(
                -player.positions.x - player.width / 2, 
                -player.positions.y - player.height / 2
                );

            c.drawImage(
                this.image,
                this.positions.x, 
                this.positions.y, 
                this.width, 
                this.height
            );  
            c.restore();  
    }            
    update() {
        if (this.image) {
            this.draw();
            this.positions.x += this.velocity.x;
        }      
    }         
}

class Projectile {
    constructor({positions ,velocity}) {
        this.positions = positions;
        this.velocity = velocity

        this.radius = 4;
    }

    draw() {
        c.beginPath();
        c.arc(this.positions.x, this.positions.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = '#fff';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.positions.x += this.velocity.x;
        this.positions.y += this.velocity.y;
    }
}

class Particule {
    constructor({positions ,velocity, radius, color}) {
        this.positions = positions;
        this.velocity = velocity

        this.radius = radius;
        this.color = color;
        this.opacity = 1;
    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.positions.x, this.positions.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.draw();
        this.positions.x += this.velocity.x;
        this.positions.y += this.velocity.y;

        this.opacity -= 0.01;
    }
}


class InvaderProjectile {
    constructor({positions ,velocity}) {
        this.positions = positions;
        this.velocity = velocity

        this.width = 3;
        this.height = 10;
    }

    draw() {
    c.fillStyle = 'red';
    c.fillRect(this.positions.x, this.positions.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.positions.x += this.velocity.x;
        this.positions.y += this.velocity.y;
    }
}


class Invader {
    constructor ({positions}) {
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image();
        image.src = './img/invaders.png';
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.positions = {
                x: positions.x,
                y: positions.y
            }
        }
    }

        draw () {
            // c.fillStyle = '#fff';
            // c.fillRect(this.positions.x, this.positions.y, this.width, this.height); 
                c.drawImage(
                    this.image,
                    this.positions.x, 
                    this.positions.y, 
                    this.width, 
                    this.height
                );  
        } 

        update({velocity}) {
            if (this.image) {
                this.draw();
                this.positions.x += velocity.x;
                this.positions.y += velocity.y;
            }      
        }     
        shoot(invaderProjectiles) {
            invaderProjectiles.push(new InvaderProjectile({
                positions: {
                    x: this.positions.x + this.width / 2,
                    y: this.positions.y + this.height 
                },
                velocity: {
                    x: 0,
                    y: 5
                }
            }));
        }
    }
    

class Grid {
    constructor () {
        this.positions = {
            x: 0,
            y: 0
    }

    this.velocity = {
        x: 5,
        y: 0
    }

    this.invaders = [];

    const rows = Math.floor(Math.random() * 5 + 2);
    const colums = Math.floor(Math.random() * 10 + 5);

    this.width = colums * 10;

        for (let x = 0; x < colums; x++) { 
            for (let y = 0; y < rows; y++) { 
            this.invaders.push(
                new Invader({
                    positions: {
                    x: x * 30,
                    y: y * 30
                }
            }
        ));
        }
    }
}

    update() {
        this.positions.x += this.velocity.x;
        this.positions.y += this.velocity.y;

        this.velocity.y = 0;

        if (this.positions.x +this.width >= canvas.width || this.positions.x <= 0) {
            this.velocity.x = - this.velocity.x;
            this.velocity.y = 30
        }
        }
    }         


const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particules = [];
const STATE = {
    cooldown: 0
}


const keys = {
    q: {
        pressed:false
    },
    d: {
        pressed:false
    },
    space: {
        pressed:false
    }
}

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
    over: false,
    active : true
}
let score = 0

function createParticules({object, color}) {
    for (let i = 0; i < 15; i++) {
        particules.push(
            new Particule({
                positions: {
                    x: object.positions.x + object.width / 2,
                    y: object.positions.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                radius : Math.random() * 3,
                color: color || '#006000'
                //'#006000'
        }));
    }
}

function animate() {
    if (!game.active) return;  
    requestAnimationFrame(animate);
    c.fillStyle = '#0c1d12';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    particules.forEach((particule, i) => 
            {
                if (particule.opacity <= 0) {
                    setTimeout(() => {
                    particules.splice(i, 1);
                }, 0);
            } else {
                particule.update();
            }
        });
    
    invaderProjectiles.forEach((invaderProjectile, index) => { 
        if (
            invaderProjectile.positions.y + invaderProjectile.height 
                >= 
            canvas.height
            ) {
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1);
                }, 0)    
        } else invaderProjectile.update()

        if (invaderProjectile.positions.y + invaderProjectile.height >= player.positions.y
            && invaderProjectile.positions.x + invaderProjectile.width >= player.positions.x
            && invaderProjectile.positions.x <= player.positions.x + player.width) {    
           
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1);
                    player.opacity = 0;
                    game.over = true;
                }, 0) 

                setTimeout(() => {
                    game.active = false;
                }, 2000)
                
            createParticules({object: player, color: 'white'});
        }

        if (game.over == true) {
            document.querySelector('.lose').style.display = 'block';
            document.querySelector('.lose').style.cursor = "default";
            document.querySelector('.btn-game_over').style.cursor = "default";
            document.querySelector('.scoring').style.display = "none";

        }
    });

    projectiles.forEach((projectile, index) => {
        if (projectile.positions.y + projectile.radius <= 0) { 
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        } else {
                projectile.update();
            }
        });

    grids.forEach((grid,gridIndex) => {
        grid.update();

    if (frames % 100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
    }

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

            projectiles.forEach((projectile, j) => {
                if(projectile.positions.y - projectile.radius <= 
                        invader.positions.y + invader.height && 
                    projectile.positions.x + projectile.radius >= 
                        invader.positions.x &&   
                    projectile.positions.x - projectile.radius <= 
                        invader.positions.x + invader.width 
                    && projectile.positions.y +
                    projectile.radius >= invader.positions.y) {
                        
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        );

                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                            )

                            
                        if (invaderFound && projectileFound) {
                            score += 100;
                            scoreEl.innerHTML = score; 
                            scoreEl2.innerHTML = score; 

                            createParticules({
                                object: invader,
                            })
                
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0];
                            const lastInvader = grid.invaders[grid.invaders.length - 1];

                            grid.width = lastInvader.positions.x
                            - firstInvader.positions.x
                            + lastInvader.width;

                            grid.positions.x = firstInvader.positions.x;
                            }
                        } else {
                            grid.invaders.splice(gridIndex, 1);
                        }
                    }, 0)
                }
            })
        })
    });

    if (keys.q.pressed && player.positions.x >= 0) {
        player.velocity.x = -7;
        player.rotation = - 0.15
    } else if (
        keys.d.pressed && 
        player.positions.x + player.width <= canvas.width) {
            player.velocity.x = 7;
            player.rotation = + 0.15
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    if (frames % 1200 === 0) {
        grids.push(new Grid());
    }

    frames++;
}

animate();

addEventListener('keydown', ({key}) => {
    if (game.over) return;

    switch (key) {
        case 'q':
        player.velocity.x = -5;   
        keys.q.pressed = true;
        break;
        
        case 'd':
       // player.velocity.x = +5;   
        keys.d.pressed = true;    
        break;

        case ' ':
            if (STATE.cooldown  == 0) {
                STATE.cooldown = 7;
                projectiles.push(new Projectile({
                    positions: {
                        x: player.positions.x + player.width / 2,
                        y: player.positions.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    },
                    // radius: 2,
                    // color: '#fff'
                }));
            }

            if (STATE.cooldown > 0) {
                STATE.cooldown-= 0.5;
            }
                
            
        // projectiles.push(
        //     new Projectile({
        //         positions: {
        //             x:player.positions.x + player.width / 2,
        //             y:player.positions.y
        //         },   
        //         velocity: {
        //             x: 0,
        //             y: -10
        //         }
        //     })   
    
        // )
            console.log(projectiles);
        break;
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'q':
        player.velocity.x = -5;   
        keys.q.pressed = false;
        break;
        
        case 'a':
            player.velocity.x = -5;   
            keys.q.pressed = false;
        break;

        case 'd':
       // player.velocity.x = +5;   
        keys.d.pressed = false;    
        break;

        case ' ':
            
        break;
    }
})