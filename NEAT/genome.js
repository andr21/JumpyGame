

function Genome(inp, out, offSpring = false){

//Initialisation
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



//Mutations

this.mutate = function(){
	console.log('mutating...');

	if(Math.random() < 0.8) { //80%
		//Mutate connection weights
		console.log('Mutate connection weights')
		for(var i = 0; i < this.connections.length; i++) {
			this.connections[i].mutateWeight();
		}

	}

	if(Math.random() < 0.5) { //50%
		//Mutate node bias'
		console.log('Mutate node bias')
		for(var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].mutateBias();
		}
	}


	//Mutate node activation function?

	//Add a connection

	//Add a node


}








//Utilities

	this.getNode = function(x){ //returns the index of a node with that Number
		for(var i = 0; i < this.nodes.length; i++) {
			if(this.nodes[i].number === x){
				return i;
			}
		}
	}




}