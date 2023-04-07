export default class Sonic {
    ring;
    etat;
    PosX;
    PosY;

    //CONSTRUCTEUR
    constructor(main, x, y) {
        this.main = main;
        this.ring = main.physics.add.sprite(x, y, 'ring').setImmovable(true);
        this.ring.body.setAllowGravity(false);
        this.etat = "exist";
        this.ring.play("ring_rotate");
        this.PosX = x;
        this.PosY = y;
    }

    //FONCTION QUI GERE LA COLLECTE
    collectable(player,ringSound){
        var tiledX = Math.round(player.x);
        var tiledY = Math.round(player.y);
        //JOUEUR ET ANNEAUX PLUS OU MOINS AUX MÊMES COORDONNÉES -- tolérance de 10
        var tol = 20; //TOLERANCE
        if (this.etat == "exist" && this.PosX - tol < tiledX && tiledX < this.PosX + tol && this.PosY - tol < tiledY && tiledY < this.PosY + tol ){
            this.etat = "recolté";
            this.ring.visible = false;
            ringSound.play();
            return 1;
        }
        else {
            return 0 ;
        }
    }
    
}