

function Genome(inp, out, offSpring = false){
	this.inputs = inp; //number of inputs
	this.outputs = out; //number of outputs

	this.layers = 2;
	this.nextNode = 0;

	this.nodes = [];
	this.connections = [];

	if(!offSpring){ //not an offspring so create a fully connected network, no hidden layers.
		//input nodes layer 0
		for(var i = 0; i < this.inputs; i++) {
			this.nodes.push(new Node(this.nextNode,0));
			this.nextNode++;
		}
		//output nodes layer 1
		for(var i = 0; i < this.outputs; i++) {
			this.nodes.push(new Node(this.nextNode,1,true));
			this.nextNode++;
		}

		for(var i = 0; i < this.inputs; i++) {
			for(var j = this.inputs; j < this.inputs + this.outputs; j++) {

				//what should the initial weights be?
				//var weight = Math.random() * this.inputs * Math.sqrt(2/this.inputs);
				var weight = Math.random() * 2 - 1;
				this.connections.push(new Connection(this.nodes[i],this.nodes[j], weight));
			}
		}


	}





	this.getNode = function(x){ //returns the index of a node with that Number
		for(var i = 0; i < this.nodes.length; i++) {
			if(this.nodes[i].number === x){
				return i;
			}
		}
	}




}