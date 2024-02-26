function createBall(){
	var coordonneApparition = getPositionAleatoirePerimetre();
	var ball = {
		'position':coordonneApparition,
		'trajectoire': getTrajectoire(coordonneApparition, historiquePosition[historiquePosition.length-1], Math.random()*40+5),
		'rebondBord':3
	};
	listeBall.push(ball);
}

function updateBall(){
	var i=0
	while (i < listeBall.length){
		var contact = false;
		for (var j = 0; j < listeClone.length; j++) {
			var clone = historiquePosition[historiquePosition.length-listeClone[j]-1];
			if (!contact && isWillInContact(listeBall[i], clone)){
				contact = rebondirPoint(listeBall[i], clone);
			}
		}
		for (var j = 0; j < listefantome.length; j++) {
			if (!contact && isWillInContact(listeBall[i], listefantome[j].position)){
				contact = rebondirPoint(listeBall[i], listefantome[j].position);
			}
		}
		for (var j = 0; j < listeBall.length; j++) {
			if (!contact && listeBall[i] !== listeBall[j] && isWillInContact(listeBall[i], listeBall[j].position)){
				contact = rebondirPoint(listeBall[i], listeBall[j].position);
			}
		}
		if (contact === false && listeBall[i].rebondBord > 0){
			var limite = getLimit(listeBall[i]);
			if (limite !== null){
				contact = rebondirBord(listeBall[i], limite);
				listeBall[i].rebondBord --;
			}
		}
		if (contact === false){
			listeBall[i].position = addPoint(listeBall[i].position, listeBall[i].trajectoire);
		}
		drawBall(listeBall[i].position, "blue");
		if (isInContact(listeBall[i].position)){
			gameOver = true;
		}
		if (isOverLimit(listeBall[i].position)){
			listeBall[i].rebondBord --;
			listeBall.splice(i, 1);
		}
		else{
			i++;
		}
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
		var nouvelleTrajectoire = mulPoint(subPoint(symetrieAxial(d, v2), p), 1/rapport);
		var nouvellePosition = addPoint(p, mulPoint(nouvelleTrajectoire, 1-rapport));
		v1.trajectoire = nouvelleTrajectoire;
		v1.position = nouvellePosition;
		return true;
	}
	return false;
}