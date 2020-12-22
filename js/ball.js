function Ball(){
	this.x = 100;
	this.y = 350;
	this.radius = 30;

	this.rect = {width: 50, height: 50}

	this.draw = function(){

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();


		if(drawRectLines === true){
			ctx.beginPath();
			ctx.strokeStyle = "#FF0000";
			ctx.rect(this.x - this.rect.width/2,this.y - this.rect.height/2,this.rect.width,this.rect.height);
			ctx.closePath();
			ctx.stroke();
			
		}

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




	this.checkCollision = function(listOfWalls){

		var rect1 = {x: this.x - this.rect.width/2, y: this.y - this.rect.height/2, width: this.rect.width, height: this.rect.height}
		
		for(var i = 0; i <= listOfWalls.length-1; i++) {
		var rect2 = {x: listOfWalls[i].x, y: listOfWalls[i].y, width: listOfWalls[i].width, height: listOfWalls[i].height}

			if (rect1.x < rect2.x + rect2.width &&
			   rect1.x + rect1.width > rect2.x &&
			   rect1.y < rect2.y + rect2.height &&
			   rect1.y + rect1.height > rect2.y) {
			    // collision detected!
			console.log('collision')
			}
		}


	}




}

