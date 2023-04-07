import Sonic from './characters/Sonic.js';
import Ring from './characters/Ring.js';
import Eggman from './characters/Eggman.js';
import Bat from './characters/Bat.js';
import Crab from './characters/Crab.js'

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
var player,nbBomb,crab_1,winText, deathSound01, crab_1_existe, eggmanSound,bat_1, bat_1_existe, explosionSound, eggman_exist, damageSound, eggman, ring_1, ring_2, ring_3,ring_4,ring_5,ring_6, ring_7, ring_8, ring_9, jumpSound,ringSound, deadSound, music, winSound, background, sonic, keyInputs, cursors, scoreText;
var ring_10,ring_11,ring_12,ring_13,ring_14,ring_15;
var RingsNb = 0;
var invincibility = false;
var game_over = false;
var win = false;
var multi = false;
var coll = "NO_CONTACT";

//PRELOAD ------------------------------------------------------------------
function preload (){
    //IMAGES
    this.load.image('back', 'src/assets/background_alternatif.png');
    this.load.image("Phaser_tuilesdejeu", "src/assets/mylevel1_tiles.png");
    this.load.image("hit_d", "src/assets/hitbox/hitbox_d.png");
    this.load.image("hit_g", "src/assets/hitbox/hitbox_G.png");
    this.load.image("bat_G", "src/assets/hitbox/Bat_Green.png");
    this.load.image("bat_R", "src/assets/hitbox/Bat_Red.png");
    this.load.image("Crab_G", "src/assets/hitbox/Crab_Green.png");
    this.load.image("Crab_R", "src/assets/hitbox/Crab_Red.png");
    //CARTE
    this.load.tilemapTiledJSON("carte", "src/datas/level_1.json"); 
    //SPRITESHEET
    this.load.spritesheet("player", "src/assets/spriteSheet/heroS.png",{frameWidth: 32,frameHeight: 42});
    this.load.spritesheet("ring", "src/assets/spriteSheet/rings.png",{frameWidth: 16,frameHeight: 16});
    this.load.spritesheet("Eggman", "src/assets/spriteSheet/Eggman.png",{frameWidth: 84,frameHeight: 53});
    this.load.spritesheet("Bomb", "src/assets/spriteSheet/Bomb.png",{frameWidth: 25,frameHeight: 26});
    this.load.spritesheet("Bat", "src/assets/spriteSheet/Bat.png",{frameWidth: 32,frameHeight: 39});
    this.load.spritesheet("Crab", "src/assets/spriteSheet/crab.png",{frameWidth: 48,frameHeight: 31});
    //MUSIQUE
    this.load.audio('music', 'src/audio/sonic_audio.mp3');
    this.load.audio('jump', 'src/audio/jump.wav');
    this.load.audio('dead', 'src/audio/dead.wav');
    this.load.audio('win', 'src/audio/win.wav');
    this.load.audio('ring_collect', 'src/audio/ring_collect.wav');
    this.load.audio('damage', 'src/audio/damage.wav');
    this.load.audio('eggman_hurt', 'src/audio/eggman_hurt.wav');
    this.load.audio('explosion_1', 'src/audio/Explosion_1.wav');
    this.load.audio('deathSound01', 'src/audio/DeathSound_01.wav');
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
    deathSound01 = this.sound.add('deathSound01');

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
    this.anims.create({key: "Bat_Move",frames: this.anims.generateFrameNumbers('Bat', { start: 0, end: 3 }),frameRate: 10,repeat: -1});
    this.anims.create({key: "Bat_Still",frames: this.anims.generateFrameNumbers('Bat', { start: 4, end:4 }),frameRate: 10,repeat: 0});
    this.anims.create({key: "Crab_Move",frames: this.anims.generateFrameNumbers('Crab', { start: 0, end:3 }),frameRate: 10,repeat: -1});

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
    nbBomb = this.add.text(900, 16, '', { fontSize: '32px', fill: '#FFC300' });
    winText = this.add.text(480,320, '', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' }).setOrigin(0.5);

    //LES ANNEAUX
    ring_1 = new Ring(this, 260, 555);ring_2 = new Ring(this, 290, 555);ring_3 = new Ring(this, 320, 555);
    ring_4 = new Ring(this, 670, 455);ring_5 = new Ring(this, 700, 455);ring_6 = new Ring(this, 640, 455);
    ring_7 = new Ring(this, 255, 300);ring_8 = new Ring(this, 285, 300);ring_9 = new Ring(this, 315, 300);
    ring_10 = new Ring(this, 112, 150);ring_11 = new Ring(this, 142, 150);ring_12 = new Ring(this, 172, 150);
    ring_13 = new Ring(this, 800, 255);ring_14 = new Ring(this, 840, 255);ring_15 = new Ring(this, 880, 255);
    
    //LES ENEMIES
    bat_1 = new Bat(this, 688, 148);
    crab_1 = new Crab(this, 870, 306);
    eggman = new Eggman(this, 480, 320,50);
    eggman_exist = true;
    bat_1_existe = true;
    crab_1_existe = true;
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
    RingsNb = RingsNb + ring_1.collectable(player,ringSound) + ring_2.collectable(player,ringSound) + ring_3.collectable(player,ringSound) + ring_4.collectable(player,ringSound) + ring_5.collectable(player,ringSound) + ring_6.collectable(player,ringSound) + ring_7.collectable(player,ringSound) + ring_8.collectable(player,ringSound) + ring_9.collectable(player,ringSound); + ring_10.collectable(player,ringSound) + ring_11.collectable(player,ringSound) + ring_12.collectable(player,ringSound) + ring_13.collectable(player,ringSound) + ring_14.collectable(player,ringSound) + ring_15.collectable(player,ringSound);

    //GESTION DE EGGMAN
    if (eggman_exist == true){
        if (multi == false){
            eggman.pattern(player);
        }
        else {
            eggman.velocity = 100;
            nbBomb.setText(eggman.nbBombM);
            eggman.control_p2(this,cursors,player);
        }
    }

    //GESTION DE BAT
    if (bat_1_existe == true){
        bat_1.pattern(player);
    }

    //GESTION DE CRAB
    if (crab_1_existe == true){
        crab_1.pattern(786,940);
    }

    //GESTION DES COLLISIONS
    //LES BOMBES LANCER PAR L'IA
    if (multi == false && eggman_exist == true && eggman.lancerBombe(this,player) != "NO_CONTACT"){
        coll = eggman.collision(player,this,eggmanSound);
    }
    //EGGMAN
    if (eggman.collision(player,this,eggmanSound) != "NO_CONTACT"){
        coll = eggman.collision(player,this,eggmanSound);
    }
    //BAT
    if (bat_1.collision(player,this,deathSound01) != "NO_CONTACT"){
        coll = bat_1.collision(player,this,deathSound01);
    }
    //CRAB
    if (crab_1.collision(player,this,deathSound01) != "NO_CONTACT"){
        coll = crab_1.collision(player,this,deathSound01);
    }

    //GESTION DES SIGNAUX DE CONTACT AVEC LES ENEMIES
    if (coll != "NO_CONTACT"){
        //SIGNAL = RED -- SONIC PREND DES DEGATS
        if (coll == "RED"){ 
            damagePlayerV2(0, this);   
        }
        //SIGNAL = EGGMAN_DEAD -- EGGMAN EST DETRUIT
        if (coll == "EGGMAN_DEAD"){
            if(eggman_exist == true){
                explosionSound.play();
                eggman_exist = false; 
                eggman.eggman.destroy();
                eggman.hitbox_D.destroy();
                eggman.hitbox_G.destroy();
            }
        }
        //SIGNAL = BAT_DEAD -- MORT DE BAT
        if (bat_1.collision(player,this,eggmanSound) == "BAT_DEAD"){
            if (bat_1_existe == true){
                bat_1_existe = false;
                setTimeout(function() {
                    bat_1.bat.destroy();
                    bat_1.hitbox_R.destroy();
                    bat_1.hitbox_G.destroy();
                }, 100);
            }
        }
        //SIGNAL = CRAB_DEAD -- MORT DE CRAB
        if (crab_1.collision(player,this,eggmanSound) == "CRAB_DEAD"){
            if (crab_1_existe == true){
                crab_1_existe = false;
                setTimeout(function() {
                    crab_1.crab.destroy();
                    crab_1.hitbox_R.destroy();
                    crab_1.hitbox_G.destroy();
                }, 100);
            }
        }
        //RESET DES SIGNAUX
        eggman.coll = "NO_CONTACT"; 
        bat_1.coll = "NO_CONTACT"; 
        crab_1.coll = "NO_CONTACT"; 
        coll = "NO_CONTACT"; 
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

    //GESTION DE LA VICTOIRE
    if (eggman_exist == false){
        if (win == false){
            restartAll(this);
            win = true;
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
    deadSound.play(); 
    player.disableBody(true, true);  
    para.add.text(game.config.width / 2, game.config.height / 2, 'Game Over', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' }).setOrigin(0.5);
    setTimeout(function() {
        window.location.reload();
    }, 2000);
}

//FONCTION POUR RE-CHARGER LE JEUX EN CAS DE VICTOIRE
function restartAll(main){
    //AFFICHAGE
    winText.setText("YOU WIN");
    // ON DETRUIT TOUT 
    //LES ANNEAUX
    ring_1.ring.destroy();ring_2.ring.destroy();ring_3.ring.destroy();
    ring_4.ring.destroy();ring_5.ring.destroy();ring_6.ring.destroy();
    ring_7.ring.destroy();ring_8.ring.destroy();ring_9.ring.destroy();
    ring_10.ring.destroy();ring_11.ring.destroy();ring_12.ring.destroy();
    ring_13.ring.destroy();ring_14.ring.destroy();ring_15.ring.destroy();
    //LES ENEMIES
    crab_1.crab.destroy();crab_1.hitbox_R.destroy();crab_1.hitbox_G.destroy();
    bat_1.bat.destroy();bat_1.hitbox_R.destroy();bat_1.hitbox_G.destroy();

    //ON RESET TOUT
    setTimeout(function() { 
        //AFFICHAGE
        winText.setText("");
        //LES VARIABLES
        RingsNb = 0;
        //SONIC
        player.x =  80;
        player.y =  420;
        //LES ANNEAUX
        ring_1 = new Ring(main, 260, 555);ring_2 = new Ring(main, 290, 555);ring_3 = new Ring(main, 320, 555);
        ring_4 = new Ring(main, 670, 455);ring_5 = new Ring(main, 700, 455);ring_6 = new Ring(main, 640, 455);
        ring_7 = new Ring(main, 255, 300);ring_8 = new Ring(main, 285, 300);ring_9 = new Ring(main, 315, 300);
        ring_10 = new Ring(main, 112, 150);ring_11 = new Ring(main, 142, 150);ring_12 = new Ring(main, 172, 150);
        ring_13 = new Ring(main, 800, 255);ring_14 = new Ring(main, 840, 255);ring_15 = new Ring(main, 880, 255);
        //LES ENEMIES
        bat_1 = new Bat(main, 688, 148);
        crab_1 = new Crab(main, 880, 306);
        var velo = eggman.velocity + 25;
        eggman = new Eggman(main, 480, 320,velo);
        eggman_exist = true;
        bat_1_existe = true;
        crab_1_existe = true;
        //FIN DU RESTART
        win = false;
    }, 2000);
}