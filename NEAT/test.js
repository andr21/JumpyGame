

//to do
// how should connection weights and node bias' be amended "peturbed"?
// activation functions???
// when adding a node, delete the old connection or disable it? this would impact fullyConnected() also.
// mutate to be able to remove a connection maybe?
// enable/disable connections
// NEATJS initial weights of new connections in addnode are wrong
//do we need to enable/disable connections, cant we just delete them? the innovation numbers takes care of the differences no?
//hmmmm i dont know if this innovation number method is correct .. because what if you get a "node 5" added to a completely differnt place? .. maybe it's okay


//lets get a graph in showing average and max score

//how can max score be going down??????
//after second loop ordering of fitness/scores is out.. something is wrong

//sort out calculate fitness!!

//best chap is not the fittest it is the one with the highest score. bug.. lots of missing nodes in places :S

var banana = new Population(100);

function boob(){
	console.log('boob');
	for(var i = 0; i < 50; i++) {
		banana.population[0].brain.mutate();
	}
	banana.population[0].brain.draw();
}

function drawXOR(){
	

		if(!banana.allDone())
		{
			console.log('update alive');
			banana.updateAlive();
		} else {
			console.log('all dead, natural selection time');
			//pauseplayXOR();
			
			banana.naturalSelection();
			banana.debugger();

			drawGraph("Generation","Max Score",banana.graphData);
			
		}

	}

//game = setInterval(drawXOR,200);

var pauseXOR = true;
var gameXOR;
pauseplayXOR();

function pauseplayXOR(){

  if(pauseXOR == true){
    gameXOR = setInterval(drawXOR,500);
    pauseXOR = false;
    console.log('Game unpaused');
  }else{
    clearInterval(gameXOR);
    pauseXOR = true;
    console.log('Game paused');
  }

}


function getMaxObjectValue(this_array, element) {
	var values = [];
	for (var i = 0; i < this_array.length; i++) {
			values.push(Math.ceil(parseFloat(this_array[i][""+element])));
	}
	values.sort(function(a,b){return a-b});
	return values[values.length-1];
}

function getMinObjectValue(this_array, element) {
	var values = [];
	for (var i = 0; i < this_array.length; i++) {
			values.push(Math.floor(parseFloat(this_array[i][""+element])));
	}
	values.sort(function(a,b){return a-b});
	return values[0];
}


var dataness = [{x:1,y:5},{x:2,y:3},{x:3,y:6},{x:4,y:106},{x:5,y:116},{x:6,y:126},{x:8,y:90}]

//drawGraph("Hello this is a graph","bobness 1234 woo",dataness);

function drawGraph(xAxisLabel,yAxisLabel,data){


	var element = document.getElementById("svg_line_graph");
			if (element){
	element.parentNode.removeChild(element);
	}
	


	var width = 600, height = 400;
	var margin = {top: 30, right: 10, bottom: 50, left: 60}, width = width - margin.left - margin.right, height = height - margin.top - margin.bottom;
	// these are graph size settings

	var minXValue = (data[0].x),
	maxXValue = data[data.length-1].x;
	minObjectValue = getMinObjectValue(data, 'y');
	maxObjectValue = getMaxObjectValue(data, 'y');

	//create the graph object
	var vis= d3.select("#metrics").append("svg")
    	.data(data)
		.attr("class", "metrics-container")
   		.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.attr("id", "svg_line_graph")
  	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var y = d3.scale.linear().domain([ minObjectValue - (.1 * minObjectValue) , maxObjectValue + (.1 * maxObjectValue) ]).range([height, 0])
	//var x = d3.time.scale().domain([minXValue, maxXValue]).range([0, width]);
	var x = d3.scale.linear().domain([minXValue, maxXValue]).range([0, width]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(5);

	vis.append("g")
	    .attr("class", "axis")
	    .style("font-size", "12px")
		.style("font-family", "Verdana, sans-serif")
	    .call(yAxis);

	vis.append("g")
		.attr("class", "axis")
	    .attr("transform", "translate(0," + height + ")")
	    .style("font-size", "12px")
		.style("font-family", "Verdana, sans-serif")
	    .call(xAxis);

	//add the axes labels
	vis.append("text")
	    .attr("class", "axis-label")
	    .attr("text-anchor", "end")
	    .attr("x", width/2 + xAxisLabel.length*3.2)
	    .attr("y", height + 40)
	    .style("font-size", "12px")
		.style("font-family", "Verdana, sans-serif")
	    .text(xAxisLabel);

	vis.append("text")
	    .attr("class", "axis-label")
	    .attr("text-anchor", "end")
	    .attr("y", 6)
	    .attr("x", -height/2 + yAxisLabel.length*3.2)
	    .attr("dy", "-3.4em")
	    .attr("transform", "rotate(-90)")
	    .style("font-size", "12px")
		.style("font-family", "Verdana, sans-serif")
	    .text(yAxisLabel);

	var line = d3.svg.line()
		.x(function(d) { return x(d["x"]); })
		.y(function(d) { return y(d["y"]); })

	vis.append("svg:path")
		.attr("d", line(data))
		.style("stroke", function() { 
			return "#000000";
		})
		.style("fill", "none")
		.style("stroke-width", "2.5");

		var dataCirclesGroup = vis.append('svg:g');

		var circles = dataCirclesGroup.selectAll('.data-point')
			.data(data);

		circles
			.enter()
			.append('svg:circle')
			.attr('class', 'dot')
			.attr('fill', function() { return "#FF8C00"; })
			.attr('cx', function(d) { return x(d["x"]); })
			.attr('cy', function(d) { return y(d["y"]); })
			.attr('r', function() { return 3; })
			.on("mouseover", function(d) {
  				d3.select(this)
					.attr("r", 8)
					.attr("class", "dot-selected")
					.transition()
      					.duration(750);
			})
			.on("mouseout", function(d) {
  				d3.select(this)
					.attr("r", 3)
					.attr("class", "dot")
					.transition()
      					.duration(750);
			});


}