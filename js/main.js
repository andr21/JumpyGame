


//global variables
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var scorecounter = document.querySelector("#score");


c.width = 900;
c.height = 450;

var ground = 40;

var ball = new Ball;
//var population = new Population(1);
var wallmanager = new WallManager;
//var topwall	= new TopWall;

var drawRectLines = false;


var game;
var pause = true;
//pauseplay();

function pauseplay(){

  if(pause == true){
    game = setInterval(draw,15);
    pause = false;
    console.log('Game unpaused');
  }else{
    clearInterval(game);
    pause = true;
    console.log('Game paused');
  }

}

function restartgame(){

	ball = new Ball;
	wallmanager = new WallManager;

}






//draw

function draw(){
	c.width = c.width;
  

  ball.draw();
  ball.update();

  //population.updateAlive();

  
  wallmanager.draw();
  wallmanager.update();

  //TODO: needs sorting
  ball.checkCollision(wallmanager.walls);
  //population.population[0].ball.checkCollision(wallmanager.walls);

  //TODO: needs sorting
  //scorecounter.innerHTML = population.population[0].ball.score;
  scorecounter.innerHTML = ball.score;
    }









//event listening
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        ball.jump();
    }
}

document.body.addEventListener("touchstart", handleTouch, false);

function handleTouch() {
 ball.jump();
}



