
function Population(size) {
	this.population = [];

	this.generation = 0;
	//this.matingPool = [];

	this.config = {
		inputs:2,
		outputs:1,
		compDiffThreshold:3,
		EDcoefficient:1,
		Wcoefficient:0.4
	};


	this.activeSpecies = [];
	//{id:1, example:"Doe", age:50, numberActive:"blue"}
	//+ max fitness? + age since max fitness increased??


//split them up into species
	//	edcoef= 1
	//	wcoef =0.4
	//	compdiff =3
	//	max fitness of specieces not improve in 15 generations then cant reproduce
	//	champion of each species with more than 5 players getscopied accross with no changes
	//	new pop: 25% just mutation


	//once we've split into species we can implement the fitness sharing and max fitness after 15 generations


	for(var i = 0; i < size; i++){
		this.population.push(new Player(this.config.inputs,this.config.outputs));
		//TODO: are these two next bits needed??
		this.population[i].brain.generateNetwork();
		this.population[i].brain.mutate();
	}



	this.updateAlive = function(){
		for(var i = 0; i < this.population.length; i++){
			if(!this.population[i].dead){
				//console.log(i);
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

		this.splitIntoSpecies();
		this.calculateFitness();

		console.log('Average score: ' + this.getAverageScore());
		this.stats();


		//TODO: temporary natural selection
		this.population.sort((a, b) => {
			return a.fitness - b.fitness;
		});
		var deletey = this.population.length/2;
		this.population.splice(0,this.population.length/2);
		
		for(var j = 0; j < deletey; j++){
			this.population.push(this.population[j+2].crossover(this.population[j+3]));
		}

		//add some more for fun
		this.population = this.population.concat(this.getChampions());

		for(var i = 0; i < this.population.length; i++){
			this.population[i].brain.mutate();
			this.population[i].dead = false;
			this.population[i].score = 0;
			this.population[i].turns = 20;
		}



		//end of TODO


		//	champion of each species with more than 5 players getscopied accross with no changes
		var children = [];



		this.generation++;
		console.log('Generation: ' + this.generation);


	}

	this.getChampions = function(){
		var champions = [];
		var newChampNeeded = true;

		for(var i = 0; i < this.population.length; i++){
			newChampNeeded = true;
			for(var j = 0; j < champions.length; j++){
				if (this.population[i].speciesId == champions[j].speciesId) {
					if(this.population[i].fitness > champions[j].fitness){
						//replace champion
						champions.splice(j,1);
						j--;
						champions.push(this.population[i])

					} 
					newChampNeeded = false;
				}
			}

			if(newChampNeeded == true){
				champions.push(this.population[i]);
			}

		}
		return champions;
	}

	this.splitIntoSpecies = function(){
		var nextSpeciesID = 0;

		for(var j = 0; j < this.activeSpecies.length; j++){ 
			this.activeSpecies[j].numberActive = 0; //reset number of active species
			this.activeSpecies[j].age ++; //+1 age
			nextSpeciesID = Math.max(nextSpeciesID,this.activeSpecies[j].id);
		}
		nextSpeciesID ++;

		for(var i = 0; i < this.population.length; i++){
			var newSpecies = true;
			for(var j = 0; j < this.activeSpecies.length; j++){
				var compdiff = this.population[i].compatabilityDistance(this.activeSpecies[j].example,this.config.EDcoefficient,this.config.Wcoefficient);
				//console.log('compdiff: ' + compdiff);
				if(compdiff <= this.config.compDiffThreshold){ //in the same species
					this.population[i].speciesId = this.activeSpecies[j].id;
					this.activeSpecies[j].numberActive++;
					newSpecies = false;
					break;
				}
			}
			if(newSpecies == true){ //add a new species to active species
				this.activeSpecies.push({id:nextSpeciesID, example:this.population[i], age:0, numberActive:1});
				this.population[i].speciesId = nextSpeciesID;
				nextSpeciesID++;
			}
		}


		for(var j = 0; j < this.activeSpecies.length; j++){ //delete empty species
			
			if(this.activeSpecies[j].numberActive == 0){
				console.log(j);
				this.activeSpecies.splice(j,1);
				j--;
			}
		}

	}


	this.calculateFitness = function(){
		var currentMax = 0;
		this.population.forEach((player) => { 
			player.calculateFitness();

			//TODO: this is where the bestome gets drawn, do I want this?
			//if(player.fitness > this.bestFitness){
			//	this.bestFitness = player.fitness;
			//	this.bestPlayer = player.clone();
			//	this.bestPlayer.brain.id = "BestGenome";
			//	this.bestPlayer.brain.draw();
			//}

			if(player.fitness > currentMax)
				currentMax = player.fitness;
		});

		//Normalize
		this.population.forEach((player) => { 
			player.fitness /= currentMax;
		});

		//fitness sharing
		for(var i = 0; i < this.population.length; i++){
			for(var j = 0; j < this.activeSpecies.length; j++){
				if(this.population[i].speciesId == this.activeSpecies[j].id){
					this.population[i].fitness /= this.activeSpecies[j].numberActive;
				}
			}
		}
		

	}


	this.getAverageScore = function(){
		let avSum = 0;
		this.population.forEach((player) => { 
			avSum += player.score;
		});

		return avSum / this.population.length;
	}

	this.stats = function(){
	
		let maxScore = 0;
		let minScore = 100000;
		let totalNodes = 0;
		this.population.forEach((player) => { 
			maxScore = Math.max(maxScore,player.score);
			minScore = Math.min(minScore,player.score);
			totalNodes += player.brain.nodes.length;
		});

		var averageNodes = totalNodes/this.population.length;

		console.log('Average number of nodes: ' + averageNodes);
		console.log('Max Score: ' + maxScore);
		console.log('Min Score: ' + minScore);

	}



}