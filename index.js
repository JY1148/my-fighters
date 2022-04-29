const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width=1024
canvas.height=576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.7

const backgronud = new Sprite({
    position: {
        x:0, y:0
    },
    imageSrc: './assets/background.png',
    scale: 0.52,
})

const shop = new Sprite({
    position:{
        x:300, y:248
    },
    imageSrc:'./assets/shop.png',
    scale: 2,
    frameMax: 6
})

const hero = new Character({
    position: {
        x:190, y:0
    },
    velocity:{
        x:0, y:0
    },
    imageSrc: './assets/Player1/Idle.png',
    frameMax: 10,
    scale: 2.5,
    offset: {
        x: 215,
        y: 107
    },
    sprites:{
        idle:{
            imageSrc:'./assets/Player1/Idle.png',
            frameMax:10,
        },
        run:{
            imageSrc:'./assets/Player1/Run.png',
            frameMax:8,
        },
        jump:{
            imageSrc:'./assets/Player1/Jump.png',
            frameMax:3,
        },
        fall:{
            imageSrc:'./assets/Player1/Fall.png',
            frameMax:3,
        },
        attack1:{
            imageSrc:'./assets/Player1/Attack1.png',
            frameMax:7,
        },
        takeHit:{
            imageSrc:'./assets/Player1/Take hit.png',
            frameMax:3,
        },
        death:{
            imageSrc:'./assets/Player1/Death.png',
            frameMax:7,
        },
    },
    attackArea:{
        offset:{
            x:0, y:20
        },
        width: 190,
        height: 120
    }
})

const enemy = new Character({
    position: {
        x:900, y:0 
    },
    velocity:{
        x:0, y:0
    },
    imageSrc: './assets/Player2/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 160
    },
    sprites:{
        idle:{
            imageSrc:'./assets/Player2/Idle.png',
            frameMax:8,
        },
        run:{
            imageSrc:'./assets/Player2/Run.png',
            frameMax:8,
        },
        jump:{
            imageSrc:'./assets/Player2/Jump.png',
            frameMax:2,
        },
        fall:{
            imageSrc:'./assets/Player2/Fall.png',
            frameMax:2,
        },
        attack1:{
            imageSrc:'./assets/Player2/Attack1.png',
            frameMax:6,
        },
        takeHit:{
            imageSrc:'./assets/Player2/Take Hit - white silhouette.png',
            frameMax:4,
        },
        death:{
            imageSrc:'./assets/Player2/Death.png',
            frameMax:6,
        },
    },
    attackArea:{
        offset:{
            x:-190, y:50
        },
        width: 160,
        height: 50
    }
})

console.log(hero);
console.log(enemy);

const keys = {
    a:{pressed: false},
    d:{pressed: false},
    ArrowLeft:{pressed: false},
    ArrowRight:{pressed: false},
}

countTimer();

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    backgronud.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0,0,canvas.width,canvas.height)
    hero.update()
    enemy.update()

    hero.velocity.x = 0
    enemy.velocity.x = 0
    
    // x movement
    if(keys.a.pressed && hero.lastKey === 'a'){
        hero.velocity.x =-5;
        hero.switchSprite('run');
    }else if(keys.d.pressed && hero.lastKey === 'd'){
        hero.velocity.x =5;
        hero.switchSprite('run');
    }else{
        hero.switchSprite('idle');
    }
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x =5;
        enemy.switchSprite('run');
    }else{
        enemy.switchSprite('idle');
    }
    // y movement
    if(hero.velocity.y<0){
        hero.switchSprite('jump');
    }else if(hero.velocity.y>0){
        hero.switchSprite('fall');
    }

    if(enemy.velocity.y<0){
        enemy.switchSprite('jump');
    }else if(enemy.velocity.y>0){
        enemy.switchSprite('fall');
    }

    //collision and get hit
    if(collision({player1:hero, player2:enemy})&&hero.isAttacking&&hero.frameCurrent===4){
        enemy.takeHit();
        hero.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    if(collision({player1:enemy, player2:hero})&&enemy.isAttacking&&enemy.frameCurrent===4){
        hero.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerHealth', {
            width: hero.health + '%'
        })
    }
    // miss
    if(hero.isAttacking && hero.frameCurrent === 4) hero.isAttacking = false
    if(enemy.isAttacking && enemy.frameCurrent === 4) enemy.isAttacking = false

    //either of players died
    if(enemy.health <=0 || hero.health <=0 ) determineWinner({hero, enemy, timerId});
}

animate();

window.addEventListener('keydown', (e)=>{
    if(!hero.dead){
        switch(e.key){
            case 'd':
                keys.d.pressed = true;
                hero.lastKey = 'd'
                break;
            case 'a':
                keys.a.pressed = true;
                hero.lastKey = 'a'
                break;
            case 'w':
                hero.velocity.y = -20;
                break;
            case 's':
                hero.attack();
                break;

        }
    }
    if(!enemy.dead){
        switch(e.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
            case 'ArrowDown':
                enemy.attack();
                break;

        }
    }
})

window.addEventListener('keyup', (e)=>{
    switch(e.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})