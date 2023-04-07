export default class Bat {
    bat;
    etat;
    hitbox_R;
    hitbox_G;
    coll;
    dors = true;
    animation = false;

    //CONSTRUCTEUR
    constructor(main, x, y) {
        this.bat = main.physics.add.sprite(x, y, 'bat').setImmovable(true);
        this.bat.play("Bat_Still");
        this.etat = "exist";
        this.bat.body.setAllowGravity(false);
        this.coll="NO_CONTACT";
        //ajout hitbox de contact
        this.hitbox_R = main.physics.add.sprite(x, y, 'bat_R').setImmovable(true);
        this.hitbox_R.body.setAllowGravity(false);
        //ajout hitbox de dégats 
        this.hitbox_G = main.physics.add.sprite(x, y-24, 'bat_G').setImmovable(true);
        this.hitbox_G.body.setAllowGravity(false);
        //je cache les hitbox
        this.hitbox_G.visible = false;
        this.hitbox_R.visible = false;
    }

    //FONCTION QUI GERE LA COLLISION AVEC SONIC
    collision(player,main,batSound){ 
        //la hitbox de contact suis bat
        this.hitbox_R.x = this.bat.x;
        this.hitbox_R.y = this.bat.y;
        //la hitbox de dégats suis bat
        this.hitbox_G.x = this.bat.x;
        this.hitbox_G.y = this.bat.y-24;
        //HITBOX RED -- sonic blessé
        main.physics.add.collider(player, this.hitbox_R, function (player){
            this.coll = ("RED"); 
        },null,this);
        //HITBOX GREEN -- bat blessé
        main.physics.add.collider(player, this.hitbox_G, function (player){
            batSound.play();
            this.bat.tint = 0xff0000;
            this.coll = ("BAT_DEAD");
        },null,this);
        //envoie du signal
        return this.coll;
    }


    //LES DEPLACEMENTS -- ici bat traque le joueur
    pattern(player){
        var marge = 25; //la hauter de différence que bat veut
        //on recupere les coordonnes du joueur
        var pX = Math.round(player.x); 
        var pY = Math.round(player.y);
        //on recupere les coordonnes de bat
        var batX = Math.round(this.bat.x); 
        var batY = Math.round(this.bat.y); 
        //bat se reveille si sonic est a moins de 50 de distance
        if (this.dors  == true && (batX - pX) < 50 ){
            this.dors = false; 
        }
        if (this.dors == false){
            //on lance l'animation
            if (this.animation == false){
                this.animation = true;
                this.bat.play("Bat_Move");
            }

            var velocity = 100; //la vitesse de base de bat
            //LES DEPLACEMENTS HORIZONTAUX
            //le joueur est juste sous bat
            if (batY == (pY - marge)){
                this.bat.setVelocityY(0);
                this.bat.flipX = false;
            }
            //le joueur est juste sous bat
            if (batX == pX){
                this.bat.setVelocityX(0);
                this.bat.flipX = false;
            }
            //le joueur est à la droite de bat
            if(batX < pX){
                this.bat.setVelocityX(velocity);     
                this.bat.flipX = true;
            }
            //le joueur est à la gauche de bat
            else if (batX > pX){
                this.bat.setVelocityX(-velocity);
                if (this.bat.flipX == true){     
                    this.bat.flipX = false;
                }
            }
            //LES DEPLACEMENTS VERTICAUX
            //le joueur sous bat
            if(batY < (pY - marge)){
                this.bat.setVelocityY(velocity);
            }
            //le joueur au dessus de bat
            else if (batY > (pY- marge)){
                this.bat.setVelocityY(-velocity);
            }
        }
    }


}
