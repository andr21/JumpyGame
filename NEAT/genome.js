

function Genome(inp, out, offSpring = false){

//Initialisation
	this.inputs = inp; //number of inputs
	this.outputs = out; //number of outputs

	
	this.nextNode = 0;

	this.nodes = [];
	this.connections = [];

	if(!offSpring){ //not an offspring so create a fully connected network, no hidden layers.
		this.layers = 2;
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

				this.connections.push(new Connection(this.nodes[i],this.nodes[j]));
			}
		}

	}


	//Network Core
	this.generateNetwork = function() {
		//Clear all outputConnections in the nodes
		this.nodes.forEach((node) => {
			node.outputConnections.splice(0, node.outputConnections.length);
		});

		//Add the connections to the Nodes
		this.connections.forEach((conn) => {
			conn.fromNode.outputConnections.push(conn);
		});

		//Prepare for feed forward
		this.sortByLayer();
	}

	this.feedForward = function(inputValues) {
		if (inputValues.length != this.inputs) {console.log('Error! number of inputs does not match network')}

		this.generateNetwork(); //Connect all up

		//Clear old inputs
		this.nodes.forEach((node) => { node.inputSum = 0; });

		//asin the values to input nodes
		for (var i = 0; i < this.inputs; i++){
			this.nodes[i].outputValue = inputValues[i];
		}

		//Engage all nodes and Extract the results from the outputs
		let result = [];
		this.nodes.forEach((node) => {
			node.engage();

			if (node.output)
				result.push(node.outputValue);
		});
		return result;
	}



	//Crossover
	this.crossover = function(partner){
		var offSpring = new Genome(this.inputs, this.outputs, true); //Child genome
		offSpring.nextNode = this.nextNode;
		offSpring.layers = this.layers;


		//Take all nodes from this parent - output node activation 50%-50%
		for(var i = 0; i < this.nodes.length; i++){
			var node = this.nodes[i].clone();
			if(node.output) {
				var partnerNode = partner.nodes[partner.getNode(node.number)];
				if(Math.random() > 0.5) {
					node.activationFunction = partnerNode.activationFunction;
					node.bias = partnerNode.bias;
				}
			}
			offSpring.nodes.push(node);
		}
		
		//Randomly take shared connections from this or the partner network
		var maxLayer = 0;
		for(var i = 0; i < this.connections.length; i++) {
			var index = this.commonConnection(this.connections[i].getInnovationNumber(), partner.connections);
			
			if(index != -1) { //Is a shared Connection -> 50/50
				var conn = Math.random() > 0.5 ? this.connections[i].clone() : partner.connections[index].clone();
				
				//Reassign nodes
				var fromNode = offSpring.nodes[offSpring.getNode(conn.fromNode.number)];
				var toNode = offSpring.nodes[offSpring.getNode(conn.toNode.number)];
				conn.fromNode = fromNode;
				conn.toNode = toNode;

				//Add this connection to the child
				if(fromNode && toNode){
					offSpring.connections.push(conn);
				}
				
			} else { //Not a shared connection -> take from this
				let conn = this.connections[i].clone();
				
				//Reassign nodes
				let fromNode = offSpring.nodes[offSpring.getNode(conn.fromNode.number)];
				let toNode = offSpring.nodes[offSpring.getNode(conn.toNode.number)];
				conn.fromNode = fromNode;
				conn.toNode = toNode;

				//Add this connection to the child
				if(fromNode && toNode){
					offSpring.connections.push(conn);
				}
			}
		}

		return offSpring;
	}


//Mutations

this.mutate = function(){
	console.log('mutating...');

//Mutate connection weights
	if(Math.random() < 0.8) { //80%
		//console.log('Mutate connection weights');
		for(var i = 0; i < this.connections.length; i++) {
			this.connections[i].mutateWeight();
		}

	}

//Mutate node bias'
	if(Math.random() < 0.5) { //50%
		//console.log('Mutate node bias');
		for(var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].mutateBias();
		}
	}


//Mutate a node activation function
	if(Math.random() < 0.1) { //10%
		//console.log('Changing a nodes activation function');
		var i = Math.floor(Math.random() * this.nodes.length);
		this.nodes[i].mutateActivation();
	}

//Add a connection
	if(Math.random() < 0.05) { //5%
		//console.log('Add a connection');
		this.addConnection();
	}

//Add a node
	if(Math.random() < 0.03) { //3%
		//console.log('Add a node');
		this.addNode();
	}

	//console.log('Done mutating.');
}



this.addNode = function(){
	var connectionIndex = Math.floor(Math.random() * this.connections.length);
	var pickedConnection = this.connections[connectionIndex];
	pickedConnection.enabled = false;
	this.connections.splice(connectionIndex,1); //delete the connection

	//Create new node
	var newNode = new Node(this.nextNode, pickedConnection.fromNode.layer + 1);
	this.nodes.forEach((node) => { //Shift all nodes layer value
		if (node.layer > pickedConnection.fromNode.layer)
			node.layer++;
	});

	var newConnection1 = new Connection(pickedConnection.fromNode, newNode,1);
	var newConnection2 = new Connection(newNode, pickedConnection.toNode,pickedConnection.weight);

	this.layers++;
	this.connections.push(newConnection1); //Add connection
	this.connections.push(newConnection2); //Add connection
	this.nodes.push(newNode); //Add node
	this.nextNode++;
}



this.addConnection = function(){

	if(this.fullyConnected()){
		//console.log('unable to add connection, fully connected')
		return; //Cannot add a connection as fully connected
	}

	//Two random nodes to connect
	var node1 = Math.floor(Math.random() * this.nodes.length);
	var node2 = Math.floor(Math.random() * this.nodes.length);

	//*two valid nodes
	while (this.nodes[node1].layer == this.nodes[node2].layer || this.nodesConnected(this.nodes[node1],this.nodes[node2])){
		node1 = Math.floor(Math.random() * this.nodes.length);
		node2 = Math.floor(Math.random() * this.nodes.length);

	}

	//switch nodes based on their layer
	if (this.nodes[node1].layer > this.nodes[node2].layer) {
		var temp = node1;
		node1 = node2;
		node2 = temp;
	}

	//add the connection
	this.connections.push(new Connection(this.nodes[node1],this.nodes[node2]));
}




//Utilities


	this.clone = function() { //Returns a copy of this genome
		let clone = new Genome(this.inputs, this.outputs, true);

		clone.nodes = [];
		
		this.nodes.forEach((node)=>{
			clone.nodes.push(node.clone());
		});

		clone.connections = [];
		this.connections.forEach((connection)=>{
			connToAdd = connection.clone()
				var fromNode = clone.nodes[clone.getNode(connToAdd.fromNode.number)];
				var toNode = clone.nodes[clone.getNode(connToAdd.toNode.number)];
				connToAdd.fromNode = fromNode;
				connToAdd.toNode = toNode;
			clone.connections.push(connToAdd);
		});

		clone.layers = this.layers;
		clone.nextNode = this.nextNode;

		return clone;
	}

	this.getNode = function(x){ //returns the index of a node with that Number
		for(var i = 0; i < this.nodes.length; i++) {
			if(this.nodes[i].number === x){
				return i;
			}
		}
	}

	this.fullyConnected = function(){
		//check if the network is fully connected
		var maxConnections = 0;
		var nodesPerLayer = [];

		//Calculate all possible connections
		//(this works because all hidden nodes are on their own layer, so this is simply inputs and outputs cannot be connected to themselves)
		this.nodes.forEach((node)=>{
			if(nodesPerLayer[node.layer] != undefined){
				nodesPerLayer[node.layer]++;
			} else {
				nodesPerLayer[node.layer] =1;
			}
		});

		//catch some bugs
		for(var i = 0; i < nodesPerLayer.length - 1; i++) {
			if(nodesPerLayer[i] == undefined){
				console.log("Error, bug, this should never hit")
				debugger;
				//nodesPerLayer[i] = 0;
			}
		}
		
		for(var i = 0; i < this.layers - 1; i++) {
			for(var j = i + 1; j < this.layers; j++) {
				maxConnections += nodesPerLayer[i] * nodesPerLayer[j];
			}
		}

		return maxConnections == this.connections.length;

	}



	this.nodesConnected = function(node1,node2){ //are two nodes connected?
		for(var i = 0; i < this.connections.length; i++) {
			var conn = this.connections[i];
			if((conn.fromNode == node1 && conn.toNode == node2) || (conn.fromNode == node2 && conn.toNode == node1)){
				return true;
			}
		}
		return false;
	}


	this.commonConnection = function(innN, connections) {
		//Search through all connections to check for
		//one with the correct Innovation Number
		for(let i = 0; i < connections.length; i++){
			if(innN == connections[i].getInnovationNumber())
				return i;
		}

		//Found nothing
		return -1;
	}

	this.sortByLayer = function(){
		//Sort all nodes by layer
		this.nodes.sort((a, b) => {
			return a.layer - b.layer;
		});
	}

	this.averageWeightDifference = function(partner){ //gets average weight difference of matching connections

		var absWeightDiff = 0;
		var numMatchingConnections = 0;
		for(let i = 0; i < this.connections.length; i++){
			var lookup = this.commonConnection(this.connections[i].getInnovationNumber(), partner.connections);
			if(lookup != -1){
				numMatchingConnections ++;
				absWeightDiff += Math.abs(this.connections[i].weight - partner.connections[lookup].weight)
			}

		}

		return absWeightDiff/numMatchingConnections;

	}


	/*
	//Handy debugger function
	this.debugger = function(message = ""){


		var helperArray = []
		var hiddenNodes = 0;
		for(var i = 0; i < this.nodes.length; i++) {

			if (this.nodes[i].layer != 0 && this.nodes[i].output ==false) {
				hiddenNodes++;
			}

			var dupe = false;
			for(var j = 0; j < helperArray.length; j++) {
				if(this.nodes[i].number == helperArray[j]){
					dupe = true;
				}
			}
			if(dupe == true){
				console.log('Error: something has gone wrong node numbers');
				console.log('this: ');
				console.log(this);
				console.log(message);
				debugger;
			}else{
				helperArray.push(this.nodes[i].number);
			}


		}

		if(this.layers != hiddenNodes + 2){
			console.log('Error: something has gone wrong with layers');
			console.log('this: ');
			console.log(this);
			console.log(message);
			debugger;
		}



	}
	*/

}










Genome.prototype.draw = function(width = 600, height = 400, container = "#svgContainer"){



var element = document.getElementById("svg_graph");
		if (element){
element.parentNode.removeChild(element);
}

		var svg = d3.select(container).append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "svg_graph");


		var force = d3.layout.force()
			.gravity(.05)
			.distance(100)
			.charge(-100)
			.size([width, height]);


		let connections = [];
		this.connections.forEach(conn => {
			connections.push({ source: this.getNode(conn.fromNode.number), target: this.getNode(conn.toNode.number), weight: conn.weight, enabled: conn.enabled });
		});

		let nodes = [];
		this.nodes.forEach(originalNode => {
			let node = originalNode.clone();
			if(node.layer == 0) {
				node.fixed = true;
				node.y =  height - (height * 0.2);
				node.x = ((width/this.inputs) * node.number) + (width/this.inputs)/2;
			}

			if(node.output) {
				node.fixed = true;
				node.y =  (height * 0.2);
				node.x = ((width/this.outputs) * (node.number - this.inputs)) + (width/this.outputs)/2;
			}

			nodes.push(node);
		});

		force.nodes(nodes)
			.links(connections)
			.start();

		var link = svg.selectAll(".link")
			.data(connections)
			.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", function (d) { return d.enabled ? (d.weight > 0 ? 0.3 + d.weight*3 : 0.3 + d.weight*-3) : 0 })
			.style("stroke", function (d) { return d.weight > 0 ? "#28B463" : "#C0392B"; });

		var node = svg.selectAll(".node")
			.data(nodes)
			.enter().append("g")
			.attr("class", "node")
			.call(force.drag);

		node.append("circle")
			//.attr("r", function (d) { return Math.abs(d.bias)*20})
			.attr("r","10")
			.attr("fill", function (d) { return d.layer == 0 ? "#515A5A" : d.output ? "#1B2631" : "#2E86C1" });
		
		node.append("text")
			.attr("dx", 14)
			.attr("dy", ".35em")
			.style("font-size", "12px")
			.style("font-family", "Verdana, sans-serif")
			//.text(function(d) { return d.number + (d.output ? "(" + "Output" + ")" : null) });
			.text(function(d) { 
				return d.number
				+ (d.layer == 0 ? " Input " : d.output ? " Output " : "")
				+ (d.layer > 0 ? "(" + activationsNames[d.activationFunction] + ")" : "")
			});
		

		force.on("tick", function () {
			link.attr("x1", function (d) { return d.source.x; })
				.attr("y1", function (d) { return d.source.y; })
				.attr("x2", function (d) { return d.target.x; })
				.attr("y2", function (d) { return d.target.y; });

			node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
		});

	}





	/*
	//Useful function for checking infinite loops
var calls = 0;
function iSuspectToBeLoopingInfititely() {
  calls += 1;
  if (calls > 500) { debugger };
}
*/