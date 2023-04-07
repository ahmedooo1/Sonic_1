export default class Crab {
    crab;
    etat;
    hitbox_R;
    hitbox_G;
    coll;
    depart;
    sens;

    //CONSTRUCTEUR
    constructor(main, x, y) {
        this.crab = main.physics.add.sprite(x, y, 'crab').setImmovable(true);
        this.crab.play("Crab_Move");
        this.etat = "exist";
        this.crab.body.setAllowGravity(false);
        this.coll="NO_CONTACT";
        this.depart = false;
        //ajout hitbox de contact
        this.hitbox_R = main.physics.add.sprite(x, y, 'Crab_R').setImmovable(true);
        this.hitbox_R.body.setAllowGravity(false);
        //ajout hitbox de dégats 
        this.hitbox_G = main.physics.add.sprite(x, y-20, 'Crab_G').setImmovable(true);
        this.hitbox_G.body.setAllowGravity(false);
        //je cache les hitbox
        this.hitbox_G.visible = false;
        this.hitbox_R.visible = false;
    }

        //FONCTION QUI GERE LA COLLISION AVEC SONIC
        collision(player,main,crabSound){ 
            //la hitbox de contact suis crab
            this.hitbox_R.x = this.crab.x;
            this.hitbox_R.y = this.crab.y;
            //la hitbox de dégats suis crab
            this.hitbox_G.x = this.crab.x;
            this.hitbox_G.y = this.crab.y-20;
            //HITBOX RED -- sonic blessé
            main.physics.add.collider(player, this.hitbox_R, function (player){
                this.coll = ("RED"); 
                //CHANGEMENT DE SENS AU CONTACT
                var velocity = 100;
                if(this.sens == ("+")){
                    this.crab.setVelocityX(-velocity);
                }
                if(this.sens == ("-")){
                    this.crab.setVelocityX(velocity);
                }
            },null,this);
            //HITBOX GREEN -- crab blessé
            main.physics.add.collider(player, this.hitbox_G, function (player){
                crabSound.play();
                this.crab.tint = 0xff0000;
                this.coll = ("CRAB_DEAD");
            },null,this);
            //envoie du signal
            return this.coll;
        }

        //LES DEPLACEMENTS -- ici des allers retours entre A et B
        pattern(ptA , ptB){ //ptA < crab < ptB
            var velocity = 100;
            //on recupere les coordonnes de crab
            var crabX = Math.round(this.crab.x); 
            //on arrive au point A --apres
            if(crabX <= ptA){
                this.crab.setVelocityX(velocity);
                this.sens = "+";
            }
            //on arrive au point B --dabord
            if(crabX >= ptB){
                this.crab.setVelocityX(-velocity);
                this.sens = "-";
            }
            if (this.depart == false){
                this.depart = true;
                this.crab.setVelocityX(velocity);
                this.sens = "+";
            }
        }
}