
//global variables
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.width = 900;
c.height = 450;

var ground = 50;

var ball = new Ball;



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


//var wall = new Wall;
var wallmanager = new WallManager;

//draw

function draw(){
	c.width = c.width;
  

  ball.draw();
  ball.update();
  
  wallmanager.draw();
  wallmanager.update();
  
    }




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



function Ball(){
	this.x = 100;
	this.y = 350;
	this.radius = 30;


	this.draw = function(){

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();

	}

	this.vel = {x: 0, y: 0};
	this.acc = {x: 0, y: 0.08};

	this.jump = function(){
		if(this.y >= c.height - ground){
			this.y = c.height - ground - 0.01
		}
		this.vel = {x: 0, y: -4};
		this.acc = {x: 0, y: 0.08};
	}


	this.update = function(){

	if(this.y >= c.height - ground){
	    this.vel.x = 0;
	    this.vel.y = 0;
	    this.acc.x = 0;
	    this.acc.y = 0;
	    this.onGround = true;
	  }


		this.x += this.vel.x;
		this.y += this.vel.y;

		this.vel.x += this.acc.x;
		this.vel.y += this.acc.y;
	}

}




function Wall(){

	this.width = 50;
	this.height = Math.random()*300 + 50;
	this.x = c.width + this.width;
	this.y = c.height - this.height;
	this.radius = 30;


	this.draw = function(){

		ctx.beginPath();
		ctx.rect(this.x,this.y,this.width,this.height);
		ctx.closePath();
		ctx.fill();

	}
	
	this.vel = {x: -1, y: 0};
	
	this.update = function(){

		this.x += this.vel.x;
		this.y += this.vel.y;

	}
	
}

function WallManager(){

	this.walls = [];

	this.tick = 0;
	this.frequency = 300;

	this.update = function(){
		
		if(this.tick === this.frequency){

			this.walls[this.walls.length] = new Wall();

			this.tick = 0;
		} else {
			this.tick = this.tick + 1;
		}


		for(var i = 0; i <= this.walls.length-1; i++) {

			this.walls[i].update();
		}


		
	}

	this.draw = function(){

		for(var i = 0; i <= this.walls.length-1; i++) {

			this.walls[i].draw();
		}
	}



}
