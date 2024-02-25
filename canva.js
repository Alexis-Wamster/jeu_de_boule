/*----------------------------------------- VARIABLE GLOBAL ---------------------------------------------------*/

var positionSouris = {'x':0, 'y':0};
var canvas = document.getElementById("jeuCanvas");
var context =  canvas.getContext('2d');
var historiquePosition = [];
var pause = false;
var gameOver = false;
var rayon = 25;
var listefantome = [];
var listeBall = [];
var listeClone = [100,200,300];


canvas.addEventListener('mousemove', eventDeplacementSouris);
canvas.addEventListener('click', eventClic);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DIMENSION = canvas.getBoundingClientRect();

/*----------------------------------------- EVENEMENTS ---------------------------------------------------*/

function eventClic(event){
	pause = !pause;
	boucle();
}
function eventDeplacementSouris(event){
	positionSouris = {
		'x':event.clientX - DIMENSION.left,
		'y': event.clientY - DIMENSION.top
	};
}

/*----------------------------------------- MOUVEMENTS ---------------------------------------------------*/

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

function updateClone(){
	for (var i = 0; i < listeClone.length; i++) {
		var cloneNumber = historiquePosition.length - listeClone[i] - 1;
		if (cloneNumber > 0 && cloneNumber < historiquePosition.length){
			drawBall(historiquePosition[cloneNumber], "red");
			if (isInContact(historiquePosition[cloneNumber])){
				gameOver = true;
			}
		}
	}
}

function drawBall(coordonnee, couleur){
	context.fillStyle = couleur;
	context.beginPath();
	context.arc(coordonnee.x, coordonnee.y, rayon, 0, Math.PI*2, false);
	context.fill();
}

/*----------------------------------------- BOUCLE ---------------------------------------------------*/

function update(){
	context.fillStyle = "rgba(255,255,255,0.25)";
	context.fillRect(0,0,DIMENSION.width, DIMENSION.height);

	historiquePosition.push(positionSouris);

	drawBall(historiquePosition[historiquePosition.length-1], "#BADA55");
	updateClone();
	if (historiquePosition.length > 301){
		var anciennePosition = historiquePosition.shift();
	}
	updateFantome();
	if (listefantome.length < 5){
		createFantome();
	}

	updateBall();
	if (listeBall.length < 5){
		createBall();
	}
}
function boucle(){
	update();
	if (!pause && !gameOver){
		requestAnimationFrame(boucle);
	}
}

boucle();

/*----------------------------------------- UTILE ---------------------------------------------------*/

function getDistance(point1, point2){
	return Math.sqrt((point1.x-point2.x)**2 + (point1.y-point2.y)**2);
}

function getTrajectoire(origine, cible, vitesse=20){
	distance = getDistance(origine, cible);
	rapport = Math.sqrt(vitesse/distance**2);
	return {
		'x': (cible.x-origine.x)*rapport,
		'y': (cible.y-origine.y)*rapport
	}
}

function addPoint(point1, point2){
	return{
		'x':point1.x+point2.x,
		'y':point1.y+point2.y
	};
}

function mulPoint(point1, rapport){
	return{
		'x':point1.x*rapport,
		'y':point1.y*rapport
	};
}

function subPoint(point1, point2){
	return{
		'x':point1.x-point2.x,
		'y':point1.y-point2.y
	};
}

function isOverLimit(point){
	if (point.x>=-rayon && point.x<=DIMENSION.width+rayon && point.y>=-rayon && point.y<=DIMENSION.height+rayon){
		return false;
	}
	return true;
}

function getLimit(point, distanceBord=rayon){
	var vp = point.trajectoire;
	var nextPosition = addPoint(point.position, vp);
	if (nextPosition.x <= distanceBord && vp.x<0){
		return {
			'position':{'x':distanceBord,'y':0},
			'trajectoire':{'x':0,'y':1}
		};
	}
	else if (nextPosition.x >= DIMENSION.width-distanceBord && vp.x>0){
		return {
			'position':{'x':DIMENSION.width-distanceBord,'y':0},
			'trajectoire':{'x':0,'y':1}
		};
	}
	else if (nextPosition.y <= distanceBord && vp.y<0){
		return {
			'position':{'x':0,'y':distanceBord},
			'trajectoire':{'x':1,'y':0}
		};
	}
	else if (nextPosition.y >= DIMENSION.height-distanceBord && vp.y>0){
		return {
			'position':{'x':0,'y':DIMENSION.height-distanceBord},
			'trajectoire':{'x':1,'y':0}
		};
	}
	return null;
}

function isInContact(point1, point2=historiquePosition[historiquePosition.length-1], distanceMax=rayon*2){
	if (getDistance(point1, point2) < distanceMax){
		return true;
	}
	return false;
}

function isWillInContact(vecteur1, point2=historiquePosition[historiquePosition.length-1], distanceMax=rayon*2){
	if (getDistance(addPoint(vecteur1.position, vecteur1.trajectoire), point2) < distanceMax){
		return true;
	}
	return false;
}

function getPositionAleatoirePerimetre(){
	var apparition = Math.random() * (2*DIMENSION.width + 2*DIMENSION.height + 8*rayon);
	if (apparition < DIMENSION.width+2*rayon){
		return {
			'x':apparition-rayon,
			'y':-rayon
		};
	}
	else if (apparition < 2*DIMENSION.width+4*rayon){
		return {
			'x':apparition-DIMENSION.width-3*rayon,
			'y':rayon+DIMENSION.height
		};
	}
	else if (apparition < 2*DIMENSION.width+6*rayon+DIMENSION.height){
		return {
			'x':-rayon,
			'y':apparition-2*DIMENSION.width-5*rayon
		};
	}
	else {
		return {
			'x':rayon+DIMENSION.width,
			'y':apparition-2*DIMENSION.width-7*rayon-DIMENSION.height
		};
	}
}

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
    return rebondir(v1,getVecteurPerpendiculaire(p,v2), true);
}

function rebondir(v1, v2, test=false){
	let p = v2.position;
	let vp = v2.trajectoire;
	let d = v1.position;
	let vd = v1.trajectoire;
	var rapport = Math.abs(getRapport(subPoint(d,p), vd));
	if (rapport <= 1){
		var nouvelleTrajectoire = mulPoint(subPoint(symetrieAxial(d, v2), p), 1/rapport);
		var nouvellePosition = addPoint(p, mulPoint(nouvelleTrajectoire, 1-rapport));
		if (test){
			console.log(symetrieAxial(d, v2,true));
			//console.log(v2);
			//console.log(v1.trajectoire);
			//console.log(nouvelleTrajectoire);
		}
		v1.trajectoire = nouvelleTrajectoire;
		v1.position = nouvellePosition;
		return true;
	}
	return false;
}

function getRapport(point1, point2){
	if (point2.x === 0){
		if (point2.y === 0){
			return 1;
		}
		else{
			return point1.y/point2.y;
		}
	}
	else{
		return point1.x/point2.x;
	}
}

function findFirstElement(listeNb, min, max){
	for (var i=0; i<listeNb.length; i++){
		if (listeNb[i] >= min && listeNb[i] <= max){
			return listeNb[i];
		}
	}
	return null;
}

function getVecteur(a,b){
    return {
    	'position': a,
    	'trajectoire': subPoint(b,a)
    };
}

function getVecteurPerpendiculaire(a,v){
	let dv = v.trajectoire;
    return {
    	'position': a,
    	'trajectoire': {
    		'x': -dv.y,
    		'y': dv.x
    	}
    };
}

function symetrieAxial(a,droite,test=false){
	let mDroite, cDroite, mPerpendiculaire, cPerpendiculaire, xIntersection, yIntersection;

    if (droite.trajectoire.x !== 0) {
    	if (droite.trajectoire.y !== 0) {
	        mDroite = droite.trajectoire.y / droite.trajectoire.x;
	        cDroite = droite.position.y - mDroite * droite.position.x;
	        mPerpendiculaire = -1 / mDroite;
	        cPerpendiculaire = a.y - mPerpendiculaire * a.x;
	        xIntersection = (cPerpendiculaire - cDroite) / (mDroite - mPerpendiculaire);
	        yIntersection = mDroite * xIntersection + cDroite;
	        if (test){
	        	console.log("1) "+mDroite+" "+cDroite);
	        	console.log("2) "+mPerpendiculaire+" "+cPerpendiculaire);
	        	console.log("3) "+xIntersection+" "+yIntersection);
	        }
	    } else {
	        xIntersection = a.x;
	        yIntersection = droite.position.y;
	    }
    } else {
        xIntersection = droite.position.x;
        yIntersection = a.y;
    }

    return {
        'x': 2 * xIntersection - a.x,
        'y': 2 * yIntersection - a.y
    };
}