var activationsNames = ["Sigmoid", "Identity", "Step", "Tanh", "ReLu"];


function Node(num, lay, isOutput = false){
	this.number = num;
	this.layer = lay;

	this.bias = Math.random() * 2 - 1; //Bias between -1 and 1
	this.output = isOutput;
	this.activationFunction = Math.floor(Math.random() * 5); //Number between 0 and 4
	this.inputSum = 0;
	this.outputValue = 0;
	this.outputConnections = [];


	this.engage = function() { //Pass down the network the calculated output value
		if (this.layer != 0){ //No activation function on input nodes
			this.outputValue = this.activation(this.inputSum + this.bias);
		}

		this.outputConnections.forEach((conn) => {
			if (conn.enabled){ //Do not pass value if connection is disabled
				conn.toNode.inputSum += conn.weight * this.outputValue; //Weighted output sum
			}
		});
	}


	this.mutateBias = function() {
		if (Math.random() < 0.1) //10% chance to set new bias randomly
			this.bias = Math.random() * 2 - 1;
		else //90% chance to amend weight

			//TODO this needs thinking about/investigating
			this.bias += rand_bm()/50;
	}

	this.mutateActivation = function() { //Randomly choose a new activationFunction
		console.log('mutate activation called from somewhere');
		this.activationFunction = Math.floor(Math.random() * 5); //Number between 0 and 4
	}



	this.clone = function(){ //Returns a copy of this node
		let node = new Node(this.number, this.layer, this.output);
		node.bias = this.bias; //Same bias
		node.activationFunction = this.activationFunction;
		return node;
	}


	this.activation = function(x) { //All the possible activation Functions
		switch (this.activationFunction) {
			case 0: //Sigmoid
				return 1 / (1 + Math.pow(Math.E, -4.9 * x));
				break;
			case 1: //Identity
				return x;
				break;
			case 2: //Step
				return x > 0 ? 1 : 0;
				break;
			case 3: //Tanh
				return Math.tanh(x);
				break;
			case 4: //ReLu
				return x < 0 ? 0 : x;
				break;
			default: //Sigmoid
				return 1 / (1 + Math.pow(Math.E, -4.9 * x));
				break;
		}
	}




}