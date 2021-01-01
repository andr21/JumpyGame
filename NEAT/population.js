
function Population(size) {
	this.population = [];

	this.generation = 0;
	//this.matingPool = [];

	this.activeSpecies = [];
	//{id:1, example:"Doe", age:50, numberActive:"blue"}
	//id, genome, how many generations its been going for, how many of them are in the population


//split them up into species
	//	edcoef= 1
	//	wcoef =0.4
	//	compdiff =3
	//	max fitness of specieces not improve in 15 generations then cant reproduce
	//	champion of each species with more than 5 players getscopied accross with no changes
	//	new pop: 25% just mutation


	//once we've split into species we can implement the fitness sharing and max fitness after 15 generations


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



	this.splitIntoSpecies = function(){

		for(var j = 0; j < this.activeSpecies.length; j++){ //reset number of active species
			this.activeSpecies[j].numberActive = 0;
		}

		for(var i = 0; i < this.population.length; i++){
			var newSpecies = true;
			for(var j = 0; j < this.activeSpecies.length; j++){
				var compdiff = this.population[i].compatabilityDistance(this.activeSpecies[j].example,EDcoefficient,Wcoefficient);
				if(compdiff <= compDiffThreshold){ //in the same species
					this.population[i].speciesId = this.activeSpecies[j].id;
					this.activeSpecies[j].numberActive++;
					newSpecies = false;
					break;
				}
			}
			if(newSpecies == true){ //add a new species to active species
				//TODO: a way to come up with unique id's
				this.activeSpecies.push({id:1, example:this.population[i], age:0, numberActive:1});
			}
		}


		for(var j = 0; j < this.activeSpecies.length; j++){ //+1 age and delete empty species
			this.activeSpecies[j].age ++;

			if(this.activeSpecies[j].numberActive == 0){
				this.activeSpecies[j].splice(j,0);
				j--;
			}
		}



	}



}