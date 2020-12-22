
//global variables
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.width = 900;
c.height = 450;

var ground = 50;

var ball = new Ball;
var wallmanager = new WallManager;

var drawRectLines = true;


var game;
var pause = true;
pauseplay();

function pauseplay(){

  if(pause == true){
    game = setInterval(draw,10);
    pause = false;
    console.log('Game unpaused');
  }else{
    clearInterval(game);
    pause = true;
    console.log('Game paused');
  }

}








//draw

function draw(){
	c.width = c.width;
  

  ball.draw();
  ball.update();
  
  wallmanager.draw();
  wallmanager.update();


  ball.checkCollision(wallmanager.walls);
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



