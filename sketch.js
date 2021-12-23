var wondergirl,gameover;
var earth, bg, alien;

var SERVE = 2;
var PLAY = 1;
var END = 0;
var gameState = SERVE;
var life = 3;
var bullets;

function preload() {
  wondergirlImg = loadImage("assets/standW.png");
  wondergirlShooting = loadImage("assets/Shoot-1.png")
  bgImg = loadImage("assets/bg.jpg");
  alienImg = loadImage("assets/standA.PNG");
  asteroidImg = loadImage("assets/asteroid.png")
  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");
  gravityImg = loadImage("assets/galaxy.jpg");
restartButtonImg = loadImage("assets/restart.png");
gameOverImg = loadImage("assets/game over.jpg");

alienDie = loadSound("alien die.mp3");
gameOverSound = loadSound("game over sound.mp3");
shootSound = loadSound("gun shooting.wav");
backgroundSound = loadSound("background sound.mp3");
}

function setup() {
  createCanvas(1366, 643);

  bg = createSprite(683, 321, 20, 20);
  bg.addImage("bg", bgImg);
  bg.scale = 2.5
  
  gameOver = createSprite(683, 321, 20, 20);
  gameOver.addImage("gameover",gameOverImg);
  gameOver.visible = false
  gameOver.scale = 1.5

  gravity = createSprite(683, 321, 20, 20);
  gravity.addImage("hdsf", gravityImg);

  wondergirl = createSprite(200, 380, 20, 20);
  wondergirl.addImage("stand", wondergirlImg);
  wondergirl.scale = .40;

  invisibleTop = createSprite(700, 5, 1366, 10);
  invisibleBottom = createSprite(700, 638, 1366, 10);
  invisibleTop.visible = false;
  invisibleBottom.visible = false;

  heart1 = createSprite(displayWidth - 150, 40, 20, 20)
  heart1.visible = false
  heart1.addImage("heart1", heart1Img)
  heart1.scale = 0.4

  heart2 = createSprite(displayWidth - 100, 40, 20, 20)
  heart2.visible = false
  heart2.addImage("heart2", heart2Img)
  heart2.scale = 0.4

  heart3 = createSprite(displayWidth - 150, 40, 20, 20)
  heart3.addImage("heart3", heart3Img)
  heart3.scale = 0.4

restartButton = createSprite(630,550,20,20);
restartButton.addImage("hdgf",restartButtonImg);
restartButton.scale = .5

imagine = createSprite(10,320,10,650);
imagine.visible = false;

  score = 0;

  alienGroup = new Group();
  asteroidGroup = new Group();
  bulletGroup = new Group();
}

function draw() {
  background(225, 225, 225);
  drawSprites();
  //backgroundSound.play();

  if (gameState === SERVE) {

    fill("red");
    textSize(90)
    text("THE GRAVITY CLASH", 200, 130);
    textSize(40);
    fill("white")
    text("Press space key to shoot and arrow keys to move up and down", 100, 250);
    text("Do not let the aliens go past you", 350, 350);
    text("shoot the aliens to kill them",400,300);
    text("Shoot the asteroids for extra points", 350,400)
    text("Good luck!", 550,450);
    fill("green")
    text("click enter to continue", 450, 600);


   wondergirl.visible = false;
   restartButton.visible = false;
  }

  if (keyDown("enter")) {
    gameState = PLAY;

  } else if (gameState === PLAY) {
    if (keyDown("UP_ARROW")) {
      wondergirl.y = wondergirl.y - 30
    }
    if (keyDown("DOWN_ARROW")) {
      wondergirl.y = wondergirl.y + 30
    }

    wondergirl.collide(invisibleTop);
    wondergirl.collide(invisibleBottom);

    wondergirl.visible = true;
    gameOver.visible = false;
    restartButton.visible = false
    spawnAlien();
    spawnAsteroids();
    //restart();
    
    alienGroup.velocityX = -(10 + 3* score/1);
    wondergirl.visible = true;

    if (life === 3) {
      heart3.visible = true
      heart1.visible = false
      heart2.visible = false
    }
    if (life === 2) {
      heart2.visible = true
      heart1.visible = false
      heart3.visible = false
    }
    if (life === 1) {
      heart1.visible = true
      heart3.visible = false
      heart2.visible = false
    }

    if (life === 0 || alienGroup.isTouching(imagine)) {
      heart1.visible = false
      heart3.visible = false
      heart2.visible = false
      gameState = END;
      gameOverSound.play();
    }
   
    if(keyWentDown("space")){
      bullet = createSprite(displayWidth-1150,wondergirl.y-30,20,10)
      bullet.velocityX = 20
      shootSound.play();
      bulletGroup.add(bullet)
      wondergirl.depth = bullet.depth
      wondergirl.depth = wondergirl.depth+2
      wondergirl.addImage(wondergirlShooting);
    }
    
    gravity.visible = false
    if(alienGroup.isTouching(wondergirl)){

      for(var i=0;i<alienGroup.length;i++){     
           
       if(alienGroup[i].isTouching(wondergirl)){
            alienGroup[i].destroy()
     //Decrease the life
       life = life-1
     
            }
      
      }
     }
  }

  if(alienGroup.isTouching(bulletGroup)){
    for(var i=0;i<alienGroup.length;i++){     
        //write a condition for zombiegroup touches bulletGroup
     if(alienGroup.isTouching(bulletGroup)){
  //destroy zombie
  alienDie.play();
          bulletGroup.destroyEach()
          alienGroup[i].destroy()
          score = score+1
          } 
    
    }
  }

  
  if(asteroidGroup.isTouching(bulletGroup)){
    for(var i=0;i<alienGroup.length;i++){     
        //write a condition for zombiegroup touches bulletGroup
     if(asteroidGroup.isTouching(bulletGroup)){
  //destroy zombie
          bulletGroup.destroyEach()
          asteroidGroup[i].destroy()
          score = score+2
          } 
    
    }
  }
 
  if(gameState === END){
  
     gameOver.visible = true;
    restartButton.visible = true;
    alienGroup.setVelocityXEach(0);
    alienGroup.destroyEach();
    wondergirl.destroy();
    asteroidGroup.destroyEach();
    }

  stroke("white");
  fill("white");
  textSize(50)
  text("Score: " + score, 50, 50);
 
  if(mousePressedOver(restartButton)) {
    window.location.reload();
  }
}

function spawnAlien() {
  if (frameCount % 50 === 0) {

    alien = createSprite(random(1800, 1000), random(100, 400), 500, 500, 40, 40)

    alien.addImage(alienImg);
    alien.scale = 0.15
    alien.velocityX = -5
    alien.setCollider("rectangle", 0, 0, 100, 100)
    alien.scale = .5
    alien.velocityX = -(10 + 3* score/300);

    alien.lifetime = 500
    alienGroup.add(alien)
  }
}

function spawnAsteroids() {
  if (frameCount % 80 === 0) {

    asteroid = createSprite(random(1800, 1000), random(100, 400), 500, 500, 40, 40)

    asteroid.addImage(asteroidImg);
    asteroid.scale = 0.15
    asteroid.velocityX = -3
    asteroid.velocityY = 5
    asteroid.setCollider("rectangle", 0, 0, 100, 100)
    asteroid.scale = .15

    asteroid.lifetime = 500
    asteroidGroup.add(asteroid)
  }
}

//function restart(){
 // gameState = PLAY;
 // restartButton.visible=false;
 // gameOver.visible = false;
 // wondergirl.visible = true;
//}