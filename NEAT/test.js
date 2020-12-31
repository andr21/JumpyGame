

//to do
// how should connection weights and node bias' be amended "peturbed"?
// activation functions???
// when adding a node, delete the old connection or disable it? this would impact fullyConnected() also.
// mutate to be able to remove a connection maybe?
// enable/disable connections
// NEATJS initial weights of new connections in addnode are wrong
//do we need to enable/disable connections, cant we just delete them? the innovation numbers takes care of the differences no?
//hmmmm i dont know if this innovation number method is correct .. because what if you get a "node 5" added to a completely differnt place? .. maybe it's okay




var banana = new Genome(2,1);

function boob(){
	banana.mutate();
	banana.draw();
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

		//var element = document.getElementById(this.id);
		//document.getElementById(container).append(element);
	}


banana.draw();