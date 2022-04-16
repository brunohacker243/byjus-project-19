//Add variables
var gamestate = "title";
var mario,marioImg,marioImgWalk,marioImgJump,marioImgDead;
var ground,groundImg,groundImgStorage,groundImg2;
var plantimg,plant,plantgroup;
var play,playImg,title,titleImg;
var gameover,gameoverimg;
var score = 0;
var gameoversound,jumpsound,titlemusic;

function preload(){
    //Load images
    groundImgStorage = loadImage("ground.png");
    marioImg = loadAnimation("marioidle.png");
    marioImgWalk = loadAnimation("mariow1.png","mariow2.png","mariow3.png");
    marioImgJump = loadImage("mariojump.png");
    plantimg = loadAnimation("plant1.png","plant2.png");
    marioImgDead = loadImage("marioded.png");
    playImg = loadImage("play.png");
    titleImg = loadImage("title.png");
    gameoverimg = loadImage("gameover.png");
    gameoversound = loadSound("death.mp3");
    jumpsound = loadSound("jump.mp3");
    titlemusic = loadSound("title.mp3");
    gamemusic = loadSound("game.mp3");
}

function setup() {
    //Create canvas, add sprites
    createCanvas(windowWidth,windowHeight);

    mario = createSprite(windowWidth/20,windowHeight/1.2,windowWidth/60,windowHeight/15);
    mario.addAnimation("walk",marioImgWalk);
    mario.addAnimation("jump",marioImgJump);
    mario.addAnimation("dead",marioImgDead);
    mario.scale = mario.width/4;
    //mario.debug = true;
    mario.setCollider("rectangle",0,0,15,15);

    ground = createSprite(windowWidth/20,windowHeight,windowWidth*50,windowHeight/10);
    

    groundImg = createSprite(windowWidth/20,windowHeight,windowWidth*50,windowHeight/10);
    groundImg2 = createSprite(windowWidth/20*10,windowHeight,windowWidth*50,windowHeight/10);
    groundImg.addImage("ground",groundImgStorage);
    groundImg2.addImage("ground",groundImgStorage);

    plantgroup = new Group;

    //Valeu pela ajuda, pro!
    //Image way
    //play = createImg("play.png");
    //play.position(windowWidth/2-80,windowHeight/1.4);
    //play.size(160,50);

    //Sprite way
    play = createSprite(windowWidth/2,windowHeight/1.4,100,100);
    play.addImage("play",playImg);
    play.scale = 4;

    title = createSprite(windowWidth/2,windowHeight/2.5,100,100);
    title.addImage("title",titleImg);
    title.scale = 3;

    gameover = createSprite(windowWidth/2,windowHeight/2.5,100,100);
    gameover.addImage("gameover",gameoverimg);
    gameover.scale = 6;

    jumpsound.play();
    // 1 second delay
    setTimeout(function(){    
    titlemusic.play();
    titlemusic.loop = true;
    }, 100);
}

function draw() {
    //Add background
    background("#6f85ff");

    if(gamestate === "END") {
        if(mousePressedOver(play)) {
            replay();
            score = 0;
        }
    }

    if(gamestate !== "title") {

    mario.visible = true;
    title.visible = false;
    if(gamestate !== "END") {
    gameoversound.stop();
    play.visible = false;
    gameover.visible = false;
    titlemusic.stop();
    }

    if(gamestate !== "END") {
    groundImg.velocityX = -6;
    groundImg2.velocityX = -12;
    }

    if(gamestate === "PLAY") {
        score += 1;
    }
    textSize(width/12);
    text(score,width/2,height/5);

    //Make mario collide
    mario.collide(ground);

    if (gamestate === "PLAY") {
    //Add mario's gravity
    mario.velocityY += 4;
    
    //Let mario jump
    if(keyDown("SPACE")) {
        jump();
    }

    //Mario's animations
    if (mario.y >= height-110) {
        mario.changeAnimation("walk",marioImgWalk);
    }
    if (plantgroup.isTouching(mario)) {
        mario.changeAnimation("dead",marioImgDead);
        console.log("DIED")
    }

    if (mario.y < height-110) {
        mario.changeAnimation("jump",marioImgJump);
    }
    
    //Spawn plants
    if(frameCount % 80 === 0) {
        spawnPlants();
    }

    //Make ground scrolling
    if(groundImg.x < width-3000) {
        groundImg.x = width/20*10;
    }
    if(groundImg2.x < width-1000) {
        groundImg2.x = width/20*10;
    }
    }
    if(gamestate === "END") {
        gamestate === "END";
        mario.velocityY = 0;
        console.log(mario.velocityY);
        play.visible = true;
        gameover.visible = true;
        if(mousePressedOver(play)) {
            gamestate = "PLAY";
            plantgroup.destroyEach();
            score = 0;
        }
    }

    //Let mario DIE
    if (plantgroup.isTouching(mario) && gamestate !== "END") {
        gamestate = "END";
        end();
        gameoversound.play();
    }


} else if(gamestate !== "END") {
    gameover.visible = false;
    mario.visible = false;
    if(mousePressedOver(play)) {
            gamestate = "PLAY";
            plantgroup.destroyEach();
            gamemusic.play();
            gamemusic.loop = true;
        }

} else if(gamestate === "END") {
    if(mousePressedOver(play)) {
        replay();
    }
}

    //Draw sprites
    drawSprites();
}

function jump() {
    //Limit mario's jumping
    if (mario.y >= height-110) {
        mario.velocityY -= 25;
        console.log("poim");
        jumpsound.play();
    }
}

function spawnPlants() {
    //Spawn plants
    plant = createSprite(width+50,height/1.1+10,50,50);
    plant.velocityX = -10;
    plant.addAnimation("plant",plantimg);
    plant.scale = 2.5;
    plant.lifeTime = width+20;
    plantgroup.add(plant);
}

function end() {
    gamestate = "END";
    plantgroup.setVelocityXEach(0);
    plantgroup.setLifetimeEach(-1);
    mario.changeAnimation("dead",marioImgDead);
    groundImg.velocityX = 0;
    groundImg2.velocityX = 0;
    gamemusic.stop();   
}

function replay() {
    gamestate = "PLAY";
    plantgroup.destroyEach();
    gamemusic.play();
    gamemusic.loop = true;
}
