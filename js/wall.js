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

		if(drawRectLines === true){
			ctx.beginPath();
			ctx.strokeStyle = "#FF0000";
			ctx.rect(this.x,this.y,this.width,this.height);
			ctx.closePath();
			ctx.stroke();
			
		}


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
