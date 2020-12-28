
function Connection(from, to, weight){
	this.fromNode = from; //type: Node
	this.toNode = to; //type: Node
	this.weight = weight; //type: Number
	this.enabled = true;

	this.mutateWeight = function() {
		if(Math.random() < 0.1) { //10% chance to set new weight randomly
			this.weight = Math.random() * 2 - 1;
		} else { //90% chance to amend weight

			//this needs thinking about/investigating
			var peturbWeight;
			if(Math.random()<0.5){
				peturbWeight = 0.1;
			} else {
				peturbWeight = -0.1
			}
			this.weight += peturbWeight;
		}

	}




}