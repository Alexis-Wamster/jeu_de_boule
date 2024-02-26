function equationDegre2(a,b,c){
	var solution = [];
	var delta = b**2 - 4*a*c;
	if (delta === 0){
		solution.push(-b/(2*a));
	}
	else if (delta > 0){
		solution.push((-b-Math.sqrt(delta))/(2*a));
		solution.push((-b+Math.sqrt(delta))/(2*a));
	}
	return solution;
}

function findFirstElement(listeNb, min, max){
	for (var i=0; i<listeNb.length; i++){
		if (listeNb[i] >= min && listeNb[i] <= max){
			return listeNb[i];
		}
	}
	return null;
}

function drawBall(coordonnee, couleur){
	context.fillStyle = couleur;
	context.beginPath();
	context.arc(coordonnee.x, coordonnee.y, rayon, 0, Math.PI*2, false);
	context.fill();
}