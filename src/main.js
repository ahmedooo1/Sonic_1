import Sonic from './characters/Sonic.js';
import Ring from './characters/Ring.js';
import Eggman from './characters/Eggman.js';

//CONFIG -------------------------------------------------------------------
var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }, 
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

//LES VARIABLES 
var player, coll, eggmanSound, explosionSound, eggman_exist, damageSound, eggman, ring_1, ring_2, ring_3,ring_4,ring_5,ring_6, ring_7, ring_8, ring_9,ring_10,ring_11,ring_12,ring_13,ring_14,ring_15, jumpSound,ringSound, deadSound, music, winSound, background, sonic, keyInputs, cursors, scoreText;
var RingsNb = 0;
var invincibility = false;
var game_over = false;
var multi = false;

//PRELOAD ------------------------------------------------------------------
function preload (){
    //IMAGES
    this.load.image('back', 'src/assets/background_1.png');
    this.load.image("Phaser_tuilesdejeu", "src/assets/mylevel1_tiles.png");
    this.load.image("hit_d", "src/assets/hitbox_d.png");
    this.load.image("hit_g", "src/assets/hitbox_G.png");
    //CARTE
    this.load.tilemapTiledJSON("carte", "src/datas/level_1.json"); 
    //SPRITESHEET
    this.load.spritesheet("player", "src/assets/heroS.png",{frameWidth: 32,frameHeight: 42});
    this.load.spritesheet("ring", "src/assets/rings.png",{frameWidth: 16,frameHeight: 16});
    this.load.spritesheet("Eggman", "src/assets/Eggman.png",{frameWidth: 84,frameHeight: 53});
    this.load.spritesheet("Bomb", "src/assets/Bomb.png",{frameWidth: 25,frameHeight: 26});
    //MUSIQUE
    this.load.audio('music', 'src/audio/sonic_audio.mp3');
    this.load.audio('jump', 'src/audio/jump.wav');
    this.load.audio('dead', 'src/audio/dead.wav');
    this.load.audio('win', 'src/audio/win.wav');
    this.load.audio('ring_collect', 'src/audio/ring_collect.wav');
    this.load.audio('damage', 'src/audio/damage.wav');
    this.load.audio('eggman_hurt', 'src/audio/eggman_hurt.wav');
    this.load.audio('explosion_1', 'src/audio/Explosion_1.wav');
}

//CREATE -------------------------------------------------------------------
function create (){

    //GESTION DE LA MUSIQUE
    music = this.sound.add('music');
    music.play({ loop: true });

    //GESTION DES SONS
    jumpSound = this.sound.add('jump');
    deadSound = this.sound.add('dead');
    winSound = this.sound.add('win');
    ringSound = this.sound.add('ring_collect');
    damageSound = this.sound.add('damage');
    eggmanSound = this.sound.add('eggman_hurt');
    explosionSound = this.sound.add('explosion_1');

    //GESTION DU CIEL
    background = this.add.image(480, 320, 'back');

    //CREATION DES ANIMS
    this.anims.create({key: "sonic_marche",frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),frameRate: 10,repeat: -1});
    this.anims.create({key: "sonic_cours",frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),frameRate: 20,repeat: -1});
    this.anims.create({key: "sonic_immobile",frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),frameRate: 0,repeat: 0});
    this.anims.create({key: "sonic_saute",frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),frameRate: 10,repeat: -1});
    this.anims.create({key: "ring_rotate",frames: this.anims.generateFrameNumbers('ring', { start: 0, end: 3 }),frameRate: 10,repeat: -1});
    this.anims.create({key: "Eggman_Move",frames: this.anims.generateFrameNumbers('Eggman', { start: 0, end: 2 }),frameRate: 10,repeat: -1});
    this.anims.create({key: "Bombe_tourne",frames: this.anims.generateFrameNumbers('Bomb', { start: 0, end: 7 }),frameRate: 10,repeat: -1});
    this.anims.create({key: "Explosion_A",frames: this.anims.generateFrameNumbers('Bomb', { start: 16, end: 20 }),frameRate: 10,repeat: 3});

    //GESTION DU CLAVIER
    cursors = this.input.keyboard.createCursorKeys();
    keyInputs = this.input.keyboard.createCursorKeys();

    //GESTION DE LA CARTE
    const carteDuNiveau = this.add.tilemap("carte");
    const tileset = carteDuNiveau.addTilesetImage("tuiles_de_jeu","Phaser_tuilesdejeu");
    const calque_background = carteDuNiveau.createStaticLayer("calque_background",tileset);
    const calque_plateformes = carteDuNiveau.createStaticLayer("calque_plateformes",tileset);  
    const calque_damage = carteDuNiveau.createStaticLayer("calque_damage",tileset);    
    calque_background.tint = 0xff0000;
    
    calque_plateformes.setCollisionByProperty({ estSolide: true });
    calque_damage.setCollisionByProperty({ estSolide: true }); 
    this.physics.world.setBounds(0, 0, 960, 640);
    this.cameras.main.setBounds(0, 0, 960, 640);

    //GESTION DU PERSONNAGE JOUABLE
    sonic = new Sonic(this, 80, 420);
    player = sonic.player;
    window.player = player;
    this.player = player;
    this.physics.add.collider(player, calque_plateformes);
    this.physics.add.collider(player, calque_damage, damagePlayer,null,this);
    this.cameras.main.startFollow(player); 

    //LE HUD
    scoreText = this.add.text(16, 16, 'rings: 0', { fontSize: '32px', fill: '#FFC300' });

    //LES ANNEAUX
    ring_1 = new Ring(this, 260, 555);ring_2 = new Ring(this, 290, 555);ring_3 = new Ring(this, 320, 555);
    ring_4 = new Ring(this, 670, 455);ring_5 = new Ring(this, 700, 455);ring_6 = new Ring(this, 640, 455);
    ring_7 = new Ring(this, 255, 300);ring_8 = new Ring(this, 285, 300);ring_9 = new Ring(this, 315, 300);
    ring_10 = new Ring(this, 125, 150);ring_11 = new Ring(this, 155, 150);ring_12 = new Ring(this, 185, 150);
    ring_13 = new Ring(this, 800, 255);ring_14 = new Ring(this, 840, 255);ring_15 = new Ring(this, 880, 255);
    //LES ENEMIES
    eggman = new Eggman(this, 480, 320);
    eggman_exist = true;
}

//UPDATE --------------------------------------------------------------------
function update(time, delta) {
    //DEPLACEMENT 
    sonic.playerMove(cursors);

    //BOUTON QUI DECLENCHE LE MULTIJOUEUR
    this.input.keyboard.on('keydown_Z', function(){multi = true;eggman.eggman.setVelocityY(0);eggman.eggman.setVelocityX(0);}, this);

    //SON DU SAUT
    if (cursors.up.isDown && player.body.onFloor()) {
        jumpSound.play();
    }

    //COLLECTE DES ANNEAUX
    RingsNb = RingsNb + ring_1.collectable(player,ringSound) + ring_2.collectable(player,ringSound) + ring_3.collectable(player,ringSound) + ring_4.collectable(player,ringSound) + ring_5.collectable(player,ringSound) + ring_6.collectable(player,ringSound) + ring_7.collectable(player,ringSound) + ring_8.collectable(player,ringSound) + ring_9.collectable(player,ringSound)+ ring_10.collectable(player,ringSound)+ ring_11.collectable(player,ringSound)+ ring_12.collectable(player,ringSound)+ ring_13.collectable(player,ringSound)+ ring_14.collectable(player,ringSound)+ ring_15.collectable(player,ringSound);

    //GESTION DE EGGMAN
    if (eggman_exist == true){
        coll = eggman.collision(player,this,eggmanSound);
        if (multi == false){
            eggman.pattern(player);
            coll = eggman.lancerBombe(this,player);
        }
        else {
            eggman.control_p2(this,cursors,player);
        }
    }

    //GESTION DES SIGNAUX DE CONTACT AVEC LES ENEMIES
    if (coll != "NO_CONTACT"){
        if (coll == "RED"){ //SIGNAL == RED --> sonic prend des dommages
            damagePlayerV2(0, this);   
        }
        if (coll == "EGGMAN_DEAD"){ //SIGNAL == EGGMAN_DEAD --> eggman est mort 
            if(eggman_exist == true){
                explosionSound.play();
            }
            eggman_exist = false; //MORT DE EGGMAN
            eggman.eggman.destroy();
            eggman.hitbox_D.destroy();
            eggman.hitbox_G.destroy();
        }
        eggman.coll = "NO_CONTACT"; //RESET DU SIGNAL
    }

    //GESTION HUD
    scoreText.setText(RingsNb);

    //GESTION DU GAME OVER
    if (RingsNb < 0){
        if (game_over == false){
            killPlayer(player,this);
            game_over = true;
        }
    }
}

//LES AUTRES FONCTIONS  ----------------------------------------------------

//APLIQUE DES DEGATS AU JOUEUR -- VERSION SANS PARAMETRES
function damagePlayer () {player.setVelocityY(-300);if (invincibility == false){damageSound.play();invincibility = true;player.tint = 0xff0000;RingsNb --;this.time.addEvent({delay: 500,callback: removeInvincibility,callbackScope: this});}}

//APLIQUE DES DEGATS AU JOUEUR -- VERSION AVEC PARAMETRES
function damagePlayerV2 (velo, main) {
    player.setVelocityY(-velo);
    //SI PREMIER CONTACT ON DEVIENS TEMPORAIREMENT INVINCIBLE
    if (invincibility == false){
        damageSound.play();
        invincibility = true;
        player.tint = 0xff0000;
        RingsNb --;
        main.time.addEvent({delay: 500,callback: removeInvincibility,callbackScope: this});
    }
}

//ENLEVE L'INVINCIBILITE
function removeInvincibility(){
    invincibility = false;
    player.clearTint();
}

//FONCTION POUR TERMINER LE JEUX ET RELANCER UN AUTRE
function killPlayer(player,para) {
    music.stop(); 
    deadSound.play(); //MARCHE PAS !!!
    player.disableBody(true, true);  
    para.add.text(game.config.width / 2, game.config.height / 2, 'Game Over', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' }).setOrigin(0.5);
    setTimeout(function() {
        window.location.reload();
    }, 2000);
}