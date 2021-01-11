

function Player(inp,out){

	this.brain = new Genome(inp,out);

	this.dead = false;

	this.score = 0;
	this.fitness = 0;

	this.vision = []; //current input values
	this.decisions = []; //current output values

	this.speciesId;

	this.clone = function() { //Returns a copy of this player
		let clone = new Player();
		clone.brain = this.brain.clone();
		clone.score = this.score;
		clone.fitness = this.fitness;
		clone.speciesId = this.speciesId;
		return clone;
	}


	this.crossover = function(partner){
		var child = new Player();
		if(partner.fitness < this.fitness){
			child.brain = this.brain.crossover(partner.brain);
		} else {
			child.brain = partner.brain.crossover(this.brain);
		}

		//mutating after crossover
		child.brain.mutate();
		return child;
	}


	//Game stuff
// BALL GAME
	this.ball = new Ball();
	this.val;

	this.look = function(){
		//TODO: inputs
		//TODO: do we need to normalise the inputs??
		//console.log(wallmanager.getDistanceAndHeightOfNextWall(this.ball.x)[0]);

		var getDH = wallmanager.getDistanceAndHeightOfNextWall(this.ball.x + this.ball.radius);
		this.vision = [
		this.ball.y/c.height , //distance from top
		this.ball.vel.y/this.ball.jumppower , //y velocity
		getDH[0] , //distance to next wall
		getDH[1] //height of next wall
		];
	}

	this.think = function(){
		this.decisions = this.brain.feedForward(this.vision);
	}

	this.move = function(){
		this.val = this.decisions[0] >= 0.5 ? 1 : 0;
	}

	this.update = function(){
		//console.log(this.val);
		if(this.val == 1){
			this.ball.jump();
		}
		this.ball.update();
		this.score = this.ball.score;
		this.dead = this.ball.dead;
		this.ball.checkCollision(wallmanager.walls);

	}

	this.show = function(){
		this.ball.draw();
	}

	

	/*
	//XOR
	this.val = 0;
	this.correctVal;

	function XOR(in1,in2){
		if( ( in1 && !in2 ) || ( !in1 && in2 ) ) {
			return 1;
		}
		return 0
	}

	this.look = function(){
	}

	this.think = function(){
	}

	this.move = function(){
	}

	this.update = function(){

		this.score =
		4 -
		Math.abs(this.brain.feedForward([0,0]) - 0) -
		Math.abs(this.brain.feedForward([1,0]) - 1) -
		Math.abs(this.brain.feedForward([0,1]) - 1) -
		Math.abs(this.brain.feedForward([1,1]) - 0)
		;

			this.dead = true;
		
	}

	this.show = function(){

		if(
			(this.brain.feedForward([0,0]) > 0.5 ? 1 : 0) == 0 &&
			(this.brain.feedForward([1,0]) > 0.5 ? 1 : 0) == 1 &&
			(this.brain.feedForward([0,1]) > 0.5 ? 1 : 0) == 1 &&
			(this.brain.feedForward([1,1]) > 0.5 ? 1 : 0) == 0 
			){

				for(var i = 0; i < 10; i++){
					console.log('DONE!!');
					
				}
				console.log(this);
				console.log('Nodes: ' + this.brain.nodes.length);
				this.brain.draw();
				pauseplayXOR();
		}

	}

*/



	this.compatabilityDistance = function(otherPlayer, EDcoefficient, Wcoefficient){
		//using neats formula but with excess and disjoint together
		var weightDiff = this.brain.averageWeightDifference(otherPlayer.brain);
		return Math.abs(this.brain.connections.length - otherPlayer.brain.connections.length)*EDcoefficient + weightDiff*Wcoefficient;

	}


	this.calculateFitness = function(){
		this.fitness = this.score;
	}



}