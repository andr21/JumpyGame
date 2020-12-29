
function Node(num, lay, isOutput = false){
	this.number = num;
	this.layer = lay;

	this.bias = Math.random() * 2 - 1; //Bias between -1 and 1
	this.output = isOutput;
	//TODO: activation functions?

	this.inputSum = 0;
	this.outputValue = 0;
	this.outputConnections = [];




	this.mutateBias = function() {
		if (Math.random() < 0.1) //10% chance to set new bias randomly
			this.bias = Math.random() * 2 - 1;
		else //90% chance to amend weight

			//TODO this needs thinking about/investigating
			this.bias += rand_bm()/50;
	}



	this.clone = function(){ //Returns a copy of this node
		let node = new Node(this.number, this.layer, this.output);
		node.bias = this.bias; //Same bias
		return node;
	}




}