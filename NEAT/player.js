

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
		return clone;
	}


	this.crossover = function(partner){
		var child = new Player();
		if(partner.fitness < this.fitness){
			child.brain = this.brain.crossover(partner.brain);
		} else {
			child.brain = partner.brain.crossover(this.brain);
		}

		//TODO mutate straight after cross over? check this
		child.brain.mutate();
		return child;

	}


	//Game stuff
/* BALL GAME
	this.ball = new Ball();
	this.val;

	this.look = function(){
		//TODO: inputs
		//TODO: do we need to normalise the inputs??
		this.vision = [-1 , -1];
	}

	this.think = function(){
		this.decisions = this.brain.feedForward(this.vision);
	}

	this.move = function(){
		this.val = this.decisions[0] >= 0 ? 1 : 0;
	}

	this.update = function(){
		//console.log(this.val);
		if(this.val == 1){
			this.ball.jump();
		}
		this.ball.update();
		this.score = this.ball.score;
		this.dead = this.ball.dead;

	}

	this.show = function(){
		this.ball.draw();
	}

	*/


	//XOR
	this.val = 0;
	this.correctVal;
	this.turns = 20;

	function XOR(in1,in2){
		if( ( in1 && !in2 ) || ( !in1 && in2 ) ) {
			return 1;
		}
		return 0
	}

	this.look = function(){
		//var input1 = Math.random()>0.5 ? 1 : 0;
		//var input2 = Math.random()>0.5 ? 1 : 0;
		//this.correctVal = XOR(input1,input2);
		//this.vision = [input1 , input2];
		//console.log('input1: ' + input1);
		//console.log('input2: ' + input2);
		//console.log('correctVal: ' + this.correctVal);


	}

	this.think = function(){
		//this.decisions = this.brain.feedForward(this.vision);
	}

	this.move = function(){
		//this.val += Math.abs(this.decisions[0] - this.correctVal)
		//console.log('raw decision: ' + this.decisions[0]);
		//console.log('val: ' + this.val);
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
				console.log(banana);
				pauseplayXOR();
		}

	}







	this.compatabilityDistance = function(otherPlayer, EDcoefficient, Wcoefficient){
		//using neats formula but with excess and sijoint together
		var weightDiff = this.brain.averageWeightDifference(otherPlayer.brain);
		return Math.abs(this.brain.connections.length - otherPlayer.brain.connections.length)*EDcoefficient + weightDiff*Wcoefficient;

	}


	this.calculateFitness = function(){
		//console.log('Score: ' + this.score);
		this.fitness = Math.pow(this.score,2);
		//console.log('Fitness: ' + this.fitness);
	}



}