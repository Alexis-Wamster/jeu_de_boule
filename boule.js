class Boule {
	constructor(couleur){
		this.couleur = couleur;
		this.vitesse = Math.random()*40+5;
		this.rayon = Math.random()*20+15;
		this.position = getPositionAleatoirePerimetre();
		this.trajectoire = getTrajectoire(this.position, historiquePosition[historiquePosition.length-1], this.vitesse);
	}

	nextFrame(){
		this.position = addPoint(this.position, this.trajectoire);
		this.draw();
		this.setGameOver();
		return !isOverLimit(this.position);
	}

	draw(){
		drawBall(this.position, this.couleur, this.rayon);
	}

	setGameOver(){
		if (isInContact(this.position, this.rayon+rayon)){
			gameOver = true;
		}
	}
}

function newBoule(){
	aleatoire = Math.random();
	if (aleatoire < 0.2){
		return new Ball();
	}
	else if (aleatoire < 0.7){
		return new Boule("black");
	}
	else{
		return new Boomerang();
	}
}