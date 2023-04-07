export default class Sonic {
    player;
    
    //CONSTRUCTEUR
    constructor(main, x, y) {
        this.main = main;
        this.player = main.physics.add.sprite(x, y, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.direction = "right";
        this.player.flipX = false;
    }

    //FONCTION QUI GERE LES DEPLACEMENTS
    playerMove(cursors){
        let currentAnim = "motionless";
        //GAUCHE MARCHE
        if (cursors.left.isDown && cursors.space.isUp) { 
            currentAnim = "walk";
            this.player.body.setVelocityX(-200);
            this.player.direction = "left";
            if (this.player.flipX == false){    
                this.player.flipX = true;
            }
        // DROITE MARCHE
        } else if (cursors.right.isDown && cursors.space.isUp) { 
            currentAnim = "walk";
            this.player.body.setVelocityX(200);
            this.player.direction = "right";
            if (this.player.flipX == true){     
                this.player.flipX = false;
            }
        //GAUCHE COURSE
        } else if (cursors.left.isDown && cursors.space.isDown) { 
            currentAnim = "run";
            this.player.body.setVelocityX(-400);
            this.player.direction = "left";
            if (this.player.flipX == false){    
                this.player.flipX = true;
            }
        // DROITE COURSE
        } else if (cursors.right.isDown && cursors.space.isDown) { 
            currentAnim = "run";
            this.player.body.setVelocityX(400);
            this.player.direction = "right";
            if (this.player.flipX == true){     
                this.player.flipX = false;
            }
        } else {
            currentAnim = "motionless";
            this.player.body.setVelocityX(0);
        }
        // SAUT
        if (cursors.up.isDown && this.player.body.onFloor() || this.player.body.touching.down){
            this.player.body.setVelocityY(-630);
        }
        if (!this.player.body.onFloor()){
            currentAnim = "jump";
        }
        //GESTION DES ANIMMS
        if (currentAnim == "walk" && this.player.anims.getCurrentKey() != "sonic_marche"){
            this.player.play("sonic_marche");
        }
        if(currentAnim == "run" && this.player.anims.getCurrentKey() != "sonic_cours"){
            this.player.play("sonic_cours");
        }
        if(currentAnim == "jump" && this.player.anims.getCurrentKey() != "sonic_saute"){
            this.player.play("sonic_saute");
        }
        if(currentAnim == "motionless" && this.player.anims.getCurrentKey() != "sonic_immobile"){
            this.player.play("sonic_immobile");
        }
    }
    
}