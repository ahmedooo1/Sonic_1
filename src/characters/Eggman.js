export default class Eggman {
    eggman;
    etat;
    hitbox_D;
    hitbox_G;
    coll;
    retreat;
    bomb;
    bomb_exist;
    pv;
    invincibility;
    nbBombM;
    velocity;

    //CONSTRUCTEUR
    constructor(main, x, y, velocity) {
        this.velocity = velocity;
        this.nbBombM = 15;
        this.invincibility = false;
        this.pv = 3;
        this.main = main;
        this.eggman = main.physics.add.sprite(x, y, 'eggman').setImmovable(true);
        this.eggman.play("Eggman_Move");
        this.etat = "exist";
        this.retreat = false;
        this.eggman.body.setAllowGravity(false);
        this.direction = "droite";
        this.coll="NO_CONTACT";
        this.bomb_exist = false;
        //ajout hitbox de contact
        this.hitbox_D = main.physics.add.sprite(x, y, 'hit_d').setImmovable(true);
        this.hitbox_D.body.setAllowGravity(false);
        //ajout hitbox de dégats 
        this.hitbox_G = main.physics.add.sprite(x, y+10, 'hit_g').setImmovable(true);
        this.hitbox_G.body.setAllowGravity(false);
        //je cache les hitbox
        this.hitbox_G.visible = false;
        this.hitbox_D.visible = false;
    }

    //FONCTION QUI GERE LA COLLISION AVEC SONIC
    collision(player,main,eggmanSound){ 
        //la hitbox de contact suis eggman
        this.hitbox_D.x = this.eggman.x;
        this.hitbox_D.y = this.eggman.y+5;
        //la hitbox de dégats suis eggman
        this.hitbox_G.x = this.eggman.x;
        this.hitbox_G.y = this.eggman.y-24;
        //gestion des collision
        main.physics.add.collider(player, this.hitbox_D, function (player){
            //sonic est blessé -- on envoie le signal RED
            this.coll = ("RED");
        },null,this);
        main.physics.add.collider(player, this.hitbox_G, function (player){
            //eggman est blessé et bat en retraite
            this.retreat = true;
            eggmanSound.play();
            this.eggman.tint = 0xff0000;
            this.coll = ("GREEN");
            //on applique les dommages
            if (this.invincibility == false){
                this.pv --;
                this.invincibility = true;
            }
            //la mort d'eggman si pv <= 0
            if (this.pv <= 0){
                this.coll = ("EGGMAN_DEAD");
                //ANIMATION D'EXPLOSION
                var explosion = main.physics.add.sprite(this.eggman.x, this.eggman.y, 'Bomb').setImmovable(true);
                explosion.body.setAllowGravity(false);
                explosion.play("Explosion_A");
            }
            main.time.addEvent({delay: 500,callback: 
                function(){
                    this.eggman.clearTint();
                    this.retreat = false;
                    this.invincibility = false;
                } ,callbackScope: this});
            //
        },null,this);
        return this.coll;
    }

    //LES LACHERS DE BOMBES DE EGGMAN
    lancerBombe(main,player){
        var pX = Math.round(player.x);
        var pY = Math.round(player.y);
        var eggY = Math.round(this.eggman.y);
        var eggX = Math.round(this.eggman.x);
        //DETRUIT LA BOMBE QUAND ELLE TOUCHE LE SOL
        if(this.bomb_exist == true && this.bomb.y == 627){
            this.bomb_exist = false;
            this.bomb.destroy();
        }
        //LANCE LA BOMBE
        var tol = 10;
        if (eggX - tol < pX && pX < eggX + tol && eggY < pY  &&  this.bomb_exist == false){
            this.bomb_exist = true;
            this.bomb = main.physics.add.sprite(eggX+5, eggY, 'Bomb');
            this.bomb.play("Bombe_tourne");
            this.bomb.setCollideWorldBounds(true);
            //CONTACT DE LA BOMBE AVEC SONIC
            main.physics.add.collider(this.bomb, player, function (player){
                this.bomb.destroy();
                this.bomb_exist = false;
                this.coll = ("RED");
            },null,this);
        }
        return this.coll;
    }

    //LES DEPLACEMENTS -- ici eggman traque le joueur
    pattern(player){
        if (this.retreat == true){ //EGGMAN EN RETRAITE
            if (this.eggman.flipX == false){ //retraite a droite
                this.eggman.setVelocityX(500);
            }
            else {
                this.eggman.setVelocityX(-500); //retraite a gauche
            }
        }
        else { //EGMAN NORMAL
            //var velocity = 50; //la vitesse de base d'eggman
            var marge = 100; //la hauter de différence que eggman veut

            //on recupere les coordonnes du joueur
            var pX = Math.round(player.x); 
            var pY = Math.round(player.y);
            //on recupere les coordonnes d'eggman
            var eggX = Math.round(this.eggman.x); 
            var eggY = Math.round(this.eggman.y); 
            
            //LES DEPLACEMENTS HORIZONTAUX
            //le joueur est à la droite d'eggman
            if(eggX < pX){
                this.eggman.setVelocityX(this.velocity);
                this.eggman.flipX = true;
            }
            //le joueur est à la gauche d'eggman
            else if (eggX > pX){
                this.eggman.setVelocityX(-this.velocity);
                if (this.eggman.flipX == true){     
                    this.eggman.flipX = false;
                }
            }
            //le joueur est sous eggman
            else if (eggX == pX){
                this.eggman.setVelocityX(0);
            }

            //LES DEPLACEMENTS VERTICAUX
            //le joueur sous eggman
            if(eggY < (pY - marge)){
                this.eggman.setVelocityY(this.velocity);
            }
            //le joueur au dessus d'eggman
            else if (eggY > (pY - marge)){
                this.eggman.setVelocityY(-this.velocity);
            }
            //le joueur est sous eggman
            else if (eggY == (pY - marge)){
                this.eggman.setVelocityY(0);
            }
        }
    }

    //CONTROLE PAR UN JOUEUR
    control_p2(main,cursors,player){
        this.eggman.setCollideWorldBounds(true);
        var eggY = Math.round(this.eggman.y);
        var eggX = Math.round(this.eggman.x);
        this.velocity = 250;

        //AJOUT DE ZQSD
        cursors = main.input.keyboard.addKeys({E_bomb:Phaser.Input.Keyboard.KeyCodes.F,E_up:Phaser.Input.Keyboard.KeyCodes.Z,E_down:Phaser.Input.Keyboard.KeyCodes.S,E_left:Phaser.Input.Keyboard.KeyCodes.Q,E_right:Phaser.Input.Keyboard.KeyCodes.D});
        //GAUCHE
        if(cursors.E_left.isDown){this.eggman.body.setVelocityX(-this.velocity);if (this.eggman.flipX == true){    this.eggman.flipX = false;}}
        // DROITE
        if(cursors.E_right.isDown){this.eggman.body.setVelocityX(this.velocity);if (this.eggman.flipX == false){     this.eggman.flipX = true;}}
        //HAUT 
        if(cursors.E_up.isDown){this.eggman.body.setVelocityY(-this.velocity);} 
        //BAS
        if(cursors.E_down.isDown){this.eggman.body.setVelocityY(this.velocity);}
        //IMMOBILE X
        if(!cursors.E_left.isDown && !cursors.E_right.isDown){
            this.eggman.body.setVelocityX(0);
        }
        //IMMOBILE Y
        if (!cursors.E_up.isDown && !cursors.E_down.isDown){
            this.eggman.body.setVelocityY(0);
        }
        //LANCER UNE BOMBE 
        if(cursors.E_bomb.isDown && this.bomb_exist == false && this.nbBombM > 0){
            this.bomb_exist = true;
            this.bomb = main.physics.add.sprite(eggX+5, eggY, 'Bomb');
            this.nbBombM --;
            this.bomb.play("Bombe_tourne");
            this.bomb.setCollideWorldBounds(true);
            //CONTACT DE LA BOMBE AVEC SONIC
            main.physics.add.collider(this.bomb, player, function (player){
                this.bomb.destroy();
                this.bomb_exist = false;
                this.coll = ("RED");
            },null,this);
        }
        //DETRUIT LA BOMBE QUAND ELLE TOUCHE LE SOL
        if(this.bomb_exist == true && this.bomb.y == 627){
            this.bomb_exist = false;
            this.bomb.destroy();
        }
    }
}
