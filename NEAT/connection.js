
function Connection(from, to, weight = Math.random() * 2 - 1){
	this.fromNode = from; //type: Node
	this.toNode = to; //type: Node
	//what should the initial weights be?
	//this.weight = Math.random() * this.inputs * Math.sqrt(2/this.inputs);
	this.weight = weight; //type: Number
	this.enabled = true;

	this.mutateWeight = function() {
		if(Math.random() < 0.1) { //10% chance to set new weight randomly
			this.weight = Math.random() * 2 - 1;
		} else { //90% chance to amend weight

			//this needs thinking about/investigating
			this.weight += rand_bm()/20;
		}

	}

	this.getInnovationNumber = function(){ //Using https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
		var k1 = this.fromNode.number;
		var k2 = this.toNode.number;
		return (1/2)*(k1 + k2)*(k1 + k2 + 1) + k2;
	}

	this.clone = function(){ //Returns a copy of this connection
		let clone = new Connection(this.fromNode, this.toNode, this.weight);
		clone.enabled = this.enabled;
		return clone;
	}


}