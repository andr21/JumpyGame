
function Population(size) {
	this.population = [];

	this.generation = 0;
	this.matingPool = [];


//split them up into species
	//this.config{
	//	edcoef= 1
	//	wcoef =0.4
	//	compdiff =3
	//	max fitness of specieces not improve in 15 generations then cant reproduce
	//	champion of each species with more than 5 players getscopied accross with no changes
	//	new pop: 25% just mutation
	//}

	for(var i = 0; i < size; i++){
		this.population.push(new Player());
		//TODO: are these two next bits needed??
		this.population[i].brain.generateNetwork();
		this.population[i].brain.mutate();
	}



	this.updateAlive = function(){
		for(var i = 0; i < this.population.length; i++){
			if(!this.population[i].dead){
				  this.population[i].look();
				  this.population[i].think();
				  this.population[i].move();
				  this.population[i].update();
				  this.population[i].show();
			}

		}

	}

	this.allDone = function(){
		for(var i = 0; i < this.population.length; i++){
			if(!this.population[i].dead){
				return false;
			}
		}
		return true;

	}

	                                          
	this.naturalSelection = function(){




	}



}