


//Parameters to consider:
// - mutate node bias and mutate connection weight amounts


function Population(size) {
	this.population = [];

	this.generation = 0;
	this.matingPool = [];

	this.config = {
		inputs:2,
		outputs:1,
		//less the number, the more species
		compDiffThreshold:3,
		//larger the numbers, the more species
		EDcoefficient:1,
		Wcoefficient:0.4
	};

	this.graphData = [];

	this.activeSpecies = [];


	for(var i = 0; i < size; i++){
		this.population.push(new Player(this.config.inputs,this.config.outputs));
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

		this.splitIntoSpecies();
		this.calculateFitness();
		this.updateSpeciesFitness();

		
		//some stats
		this.stats();

	
		//sort population by fitness, fittest first
		this.population.sort((a, b) => {
			return b.fitness - a.fitness;
		});



	//	champion of each species with more than 5 players gets copied accross with no changes
		var children = [];
		var champions = this.getChampions();


		for(var i = 0; i < champions.length; i++){
			children.push(champions[i].clone());
		}
		//console.log('champions added: ' + champions.length);

	//50%: take the top 50% and mutate
		for(var i = 0; i < Math.floor((this.population.length - children.length) * 0.5); i++){
			var playerToAdd = this.population[i].clone();
			playerToAdd.brain.generateNetwork();
			playerToAdd.brain.mutate();

			children.push(playerToAdd);

		}


	//50%: cross over randomly with the top 50%

		//fill mating pool
		//TODO: need to think about this more.. especially the divide by 2
		this.matingPool = [];
		for(var i = 0; i < Math.floor(this.population.length / 2); i++){
			this.matingPool.push(this.population[i]);
			
		}

		var numToAdd = children.length;
		for(let i = 0; i < this.population.length - numToAdd; i++){

				

				var parent1 = Math.floor(Math.random() * this.matingPool.length);
				var parent2 = Math.floor(Math.random() * this.matingPool.length);

				//*two valid nodes
				while (parent1 == parent2){
					parent1 = Math.floor(Math.random() * this.matingPool.length);
					parent2 = Math.floor(Math.random() * this.matingPool.length);
				}


			var toBeAdded = this.matingPool[parent1].crossover(this.matingPool[parent2]);
				children.push(toBeAdded);
			
		}

		//remainder: crossover and mutate
		//TODO not currently doing this as we currently always mutate when we crossover..needs checking


		this.generation++;
		console.log('Generation: ' + this.generation);

		this.population = children;

		for(var i = 0; i < this.population.length; i++){
			this.population[i].brain.generateNetwork();
		}

		this.cleanPopulation();
	}


	//TO DO: think this function is redundant now
	this.selectPlayer = function(){
		let rand = Math.floor(Math.random() *  this.matingPool.length);
		return this.matingPool[rand];
	}

	this.getBestScoreIndex = function() {
		var bestScore = 0
		var index = 0
		for(var i = 0; i < this.population.length; i++){
			if(this.population[i].score > bestScore){
				bestScore = this.population[i].score;
				index = i;
			}
		}
		return index;
	}


	this.cleanPopulation = function(){
		for(var i = 0; i < this.population.length; i++){
			this.population[i].score = 0.0;
			this.population[i].fitness = 0.0;
			this.population[i].dead = false;
		}

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
						champions.push(this.population[i].clone())

					} 
					newChampNeeded = false;
				}
			}

			if(newChampNeeded == true){
				champions.push(this.population[i].clone());
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
				
				if(compdiff <= this.config.compDiffThreshold){ //in the same species
					this.population[i].speciesId = this.activeSpecies[j].id;
					this.activeSpecies[j].numberActive++;
					newSpecies = false;
					break;
				}
			}
			if(newSpecies == true){ //add a new species to active species
				this.activeSpecies.push({id:nextSpeciesID, example:this.population[i], age:0, numberActive:1 , maxFitness:0, notImprovedFor:0});
				this.population[i].speciesId = nextSpeciesID;
				nextSpeciesID++;
			}
		}


		for(var j = 0; j < this.activeSpecies.length; j++){ //delete empty species
			
			if(this.activeSpecies[j].numberActive == 0){
				console.log('Species removed');
				this.activeSpecies.splice(j,1);
				j--;
			}
		}

	}

	this.updateSpeciesFitness =function(){ 

		//TODO need to implement not improved for x
		for(var i = 0; i < this.population.length; i++){
			for(var j = 0; j < this.activeSpecies.length; j++){
				console.log(this.population[i].fitness);
				console.log(this.activeSpecies[j].maxFitness);
				if(this.population[i].speciesId == this.activeSpecies[j].id
					&& this.population[i].fitness > this.activeSpecies[j].maxFitness //TODO maybe round this?
					){
						
						this.activeSpecies[j].maxFitness = this.population[i].fitness

				}
			}
		}


	}


	this.calculateFitness = function(){
		//var currentMax = 0;
		this.population.forEach((player) => { 
			player.calculateFitness();

		});



		//fitness sharing
		for(var i = 0; i < this.population.length; i++){
			for(var j = 0; j < this.activeSpecies.length; j++){
				
				if(this.population[i].speciesId == undefined){
					console.log('missing species id');
					debugger;
				}

				if(this.population[i].speciesId == this.activeSpecies[j].id){
					this.population[i].fitness /= this.activeSpecies[j].numberActive;
				}
			}
		}

		var currentMax = 0;
		this.population.forEach((player) => { 
			if(player.fitness > currentMax)
				currentMax = player.fitness;
		});


		//Normalize
		//this.population.forEach((player) => { 
		//	player.fitness /= currentMax;
		//});
		

	}


	this.getAverageScore = function(){
		let avSum = 0;
		this.population.forEach((player) => { 
			avSum += player.score;
		});

		return avSum / this.population.length;
	}

	this.stats = function(){

		console.log('Average score: ' + this.getAverageScore());

		//best chap
		var bestIndex = this.getBestScoreIndex();
		console.log('Index: ' + bestIndex)
		this.population[bestIndex].brain.draw();
		console.log(' ');
		console.log('best chap:');
		console.log(this.population[bestIndex]);
		console.log('0,0: ' + this.population[bestIndex].brain.feedForward([0,0]));
		console.log('1,0: ' + this.population[bestIndex].brain.feedForward([1,0]));
		console.log('0,1: ' + this.population[bestIndex].brain.feedForward([0,1]));
		console.log('1,1: ' + this.population[bestIndex].brain.feedForward([1,1]));


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
		console.log('Number of species: ' + this.activeSpecies.length);


		//this.graphData.push({x: this.generation, y: maxScore})
		this.graphData.push({x: this.generation, y: this.activeSpecies[0].maxFitness})

	}




}