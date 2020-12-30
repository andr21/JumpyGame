

function Player(){

	this.brain = new Genome(2,1);

	this.dead = false;
	this.fitness;

	this.vision = []; //current input values
	this.decisions = []; //current output values


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
		this.dead = this.ball.dead;

	}

	this.show = function(){
		this.ball.draw();
	}




	this.calculateFitness = function(){
		this.fitness = this.ball.score;

	}



}