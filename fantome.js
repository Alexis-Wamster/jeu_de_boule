function createFantome(){
	var coordonneApparition = getPositionAleatoirePerimetre();
	var fantome = {
		'position':coordonneApparition,
		'trajectoire': getTrajectoire(coordonneApparition, historiquePosition[historiquePosition.length-1], Math.random()*40+5)
	};
	listefantome.push(fantome);
}

function updateFantome(){
	var i=0
	while (i < listefantome.length){
		fantome = listefantome[i];
		fantome.position = addPoint(fantome.position, fantome.trajectoire);
		drawBall(fantome.position, "black");
		if (isInContact(fantome.position)){
			gameOver = true;
		}
		if (isOverLimit(fantome.position)){
			listefantome.splice(i, 1);
		}
		else{
			i++;
		}
	}
}