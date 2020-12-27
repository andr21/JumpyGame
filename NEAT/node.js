
function Node(num, lay, isOutput = false){
	this.number = num;
	this.layer = lay;

	this.bias = Math.random() * 2 - 1; //Bias between -1 and 1
	this.output = isOutput;

	this.inputSum = 0;
	this.outputValue = 0;
	this.outputConnections = [];




	this.clone = function(){ //Returns a copy of this node
		let node = new Node(this.number, this.layer, this.output);
		node.bias = this.bias; //Same bias
		return node;
	}
}