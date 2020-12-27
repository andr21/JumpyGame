function Wall(){

	this.width = 50;
	this.height = Math.random()*300 + 50;
	this.x = c.width + this.width;
	this.y = c.height - this.height;


	this.wallspeed = 4;

	this.gone = false;



	this.draw = function(){

		ctx.beginPath();
		ctx.rect(this.x,this.y,this.width,this.height);
		ctx.closePath();
		ctx.fillStyle = "#000000";
		ctx.fill();

		if(drawRectLines === true){
			ctx.beginPath();
			ctx.strokeStyle = "#FF0000";
			ctx.rect(this.x,this.y,this.width,this.height);
			ctx.closePath();
			ctx.stroke();
			
		}


	}
	
	this.vel = {x: this.wallspeed * -1, y: 0};
	
	this.update = function(){

		this.x += this.vel.x;
		this.y += this.vel.y;

		if (this.x < 0 - this.width){
			this.gone = true;
		}

	}
	
}



function TopWall(){

	this.width = c.width + 20;
	this.height = 40;
	this.x = -10
	this.y = -30


		this.draw = function(){

		ctx.beginPath();
		ctx.rect(this.x,this.y,this.width,this.height);
		ctx.closePath();
		ctx.fillStyle = "#000000";
		ctx.fill();

		if(drawRectLines === true){
			ctx.beginPath();
			ctx.strokeStyle = "#FF0000";
			ctx.rect(this.x,this.y,this.width,this.height);
			ctx.closePath();
			ctx.stroke();
			
		}

		this.update = function(){

		}


	}

}







function WallManager(){

	var topwall = new TopWall
	this.walls = [topwall];

	this.tick = 199;
	this.frequency = 200;

	this.update = function(){
		
		//add new wall
		if(this.tick === this.frequency){

			this.walls[this.walls.length] = new Wall();

			this.tick = 0;
		} else {
			this.tick = this.tick + 1;
		}

		//remove all walls that have gone off screen
		for(var i = 0; i < this.walls.length; i++) {
			if(this.walls[i].gone === true){

				this.walls.splice(i,1);
	  		i -= 1;
	  		//console.log('wall removed');
			}
		}


		//update all the walls
		for(var i = 0; i < this.walls.length; i++) {

			this.walls[i].update();
		}


		
	}

	this.draw = function(){

		for(var i = 0; i < this.walls.length; i++) {

			this.walls[i].draw();
		}
	}



}
