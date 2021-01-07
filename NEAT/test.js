

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

//had a look over up to genome utilities and the second half of test

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

			drawGraph("Generation","Max Score",banana.graphData);
			
		}

	}


var pauseXOR = true;
var gameXOR;
pauseplayXOR();

function pauseplayXOR(){

  if(pauseXOR == true){
    gameXOR = setInterval(drawXOR,100);
    pauseXOR = false;
    console.log('Game unpaused');
  }else{
    clearInterval(gameXOR);
    pauseXOR = true;
    console.log('Game paused');
  }

}



