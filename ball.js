class Ball extends Boule{
	constructor(){
		super("blue");
		this.rebondBord = 3;
	}

	nextFrame(){
		var contact = false;
		for (var i = 0; i < listeClone.length; i++) {
			if (!contact && isWillInContact(this, this.rayon+rayon, listeClone[i])){
				contact = rebondirPoint(this, listeClone[i], this.rayon+rayon);
			}
		}
		for (var i = 0; i < listeBoule.length; i++) {
			if (!contact && this !== listeBoule[i] && isWillInContact(this, this.rayon+listeBoule[i].rayon, listeBoule[i].position)){
				contact = rebondirPoint(this, listeBoule[i].position, this.rayon+listeBoule[i].rayon);
			}
		}
		if (contact === false && this.rebondBord > 0){
			var limite = getLimit(this);
			if (limite !== null){
				contact = rebondirBord(this, limite);
				this.rebondBord --;
			}
		}
		if (contact === false){
			this.position = addPoint(this.position, this.trajectoire);
		}
		this.draw();
		this.setGameOver();
		return !isOverLimit(this.position);
	}
} 

// point d'intersection entre la droite d et le cercle de centre o et de rayon r
function rebondirPoint(v1, o, r=2*rayon){
	let d = v1.position;
	let vd = v1.trajectoire;
	var a = (vd.x)**2 + (vd.y)**2;
	var b = 2*vd.x*(d.x - o.x) + 2*vd.y*(d.y - o.y);
	var c = (d.x - o.x)**2 + (d.y - o.y)**2 - r**2;
	var listeSolution = equationDegre2(a,b,c);
	var solution = findFirstElement(listeSolution, 0, 1);
	if (solution !== null){
		var p = addPoint(d, mulPoint(vd, solution));
		return rebondir(v1,getVecteur(p,o));
	}
	return false;
}

// point d'intersection p entre 2 droite v1 et v2
function rebondirBord(v1, v2){
	let o = v2.position;
	let vo = v2.trajectoire;
	let a = v1.position;
	let va = v1.trajectoire;
	let t = ((o.x - a.x) * vo.y - (o.y - a.y) * vo.x) / (va.x * vo.y - va.y * vo.x); 
	let p = addPoint(a, mulPoint(va, t));
    return rebondir(v1,getVecteurPerpendiculaire(p,v2));
}

function rebondir(v1, v2){
	let p = v2.position;
	let vp = v2.trajectoire;
	let d = v1.position;
	let vd = v1.trajectoire;
	var rapport = Math.abs(getRapport(subPoint(d,p), vd));
	if (rapport <= 1){
		var nouvelleTraiectoire = mulPoint(subPoint(symetrieAxial(d, v2), p), 1/rapport);
		var nouvellePosition = addPoint(p, mulPoint(nouvelleTraiectoire, 1-rapport));
		v1.trajectoire = nouvelleTraiectoire;
		v1.position = nouvellePosition;
		return true;
	}
	return false;
}