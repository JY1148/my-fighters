class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset = { x: 0, y: 0 }
    }){
        this.position = position;
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frameMax = frameMax
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    //绘制
    //this.frameCurrent---i
    //this.image.width/this.frameMax---w
    //this.image.height---h
    draw(){
        if(this.image.src.includes('Player2')){
            // c.translate(this.image.width /this.frameMax, 0);
            c.scale(-1,1);
            c.drawImage(this.image,
                this.frameCurrent * (this.image.width/this.frameMax),
                0,
                this.image.width /this.frameMax,
                this.image.height,
                -this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                (this.image.width / this.frameMax) * this.scale,
                this.image.height * this.scale
            )
            c.setTransform(1,0,0,1,0,0);
        }else{
            c.drawImage(
                this.image,
                this.frameCurrent * (this.image.width/this.frameMax),
                0,
                this.image.width /this.frameMax,
                this.image.height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                (this.image.width / this.frameMax) * this.scale,
                this.image.height * this.scale
            )
        }
    }

    //换图
    animateFrames(){
        this.frameElapsed++;
        //每隔framesHold秒换一次帧图
        if(this.frameElapsed % this.framesHold === 0){
            //循环帧图
            if( this.frameCurrent < this.frameMax - 1){
                this.frameCurrent++;
            }else{
                this.frameCurrent=0;
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()
    }
}

class Character extends Sprite{
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset = { x:0, y:0 },
        sprites,
        attackArea = { offset: {}, width: undefined, height: undefined }
    }){
        super({ position, imageSrc, scale, frameMax, offset })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackArea = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackArea.offset,
            width: attackArea.width,
            height: attackArea.height
        }
        
        this.color = color
        this.isAttacking
        this.health = 100
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.framesHold = 5
        this.dead = false

        //image source
        this.sprites = sprites
        for(let sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update(){
        this.draw();
        if(!this.dead) this.animateFrames();

        this.attackArea.position.x = this.position.x + this.attackArea.offset.x
        this.attackArea.position.y = this.position.y + this.attackArea.offset.y

        //visualize attack area
        // c.fillRect(this.attackArea.position.x, this.attackArea.position.y, this.attackArea.width, this.attackArea.height);

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height-90){
            //stop on the ground and not move
            this.velocity.y = 0
            this.position.y = 368
        }else{
            // faster and faster
            this.velocity.y += gravity
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 10
        if(this.health<=0){
            this.switchSprite('death')
        }else{
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite){
        if(this.image === this.sprites.death.image){
            if(this.frameCurrent === this.sprites.death.frameMax-1){
                this.dead = true
            }
            return
        }

        //contineous attack
        if(this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.frameMax - 1) return
        
        //continueous takeHit
        if(this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.frameMax - 1) return
        
        switch(sprite){
            case 'idle':
                //TODO: what if I have no 'if' condition?
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.frameMax = this.sprites.idle.frameMax
                    this.frameCurrent = 0
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.frameMax = this.sprites.run.frameMax
                    this.frameCurrent = 0
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.frameMax = this.sprites.jump.frameMax
                    this.frameCurrent = 0
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.frameMax = this.sprites.fall.frameMax
                    this.frameCurrent = 0
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.frameMax = this.sprites.attack1.frameMax
                    this.frameCurrent = 0
                }
                break;
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.frameMax = this.sprites.takeHit.frameMax
                    this.frameCurrent = 0
                }
                break;
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.frameMax = this.sprites.death.frameMax
                    this.frameCurrent = 0
                }
                break;
        }
    }
}