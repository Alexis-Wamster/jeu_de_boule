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

function symetrieAxial(a,droite){
	let mDroite, cDroite, mPerpendiculaire, cPerpendiculaire, xIntersection, yIntersection;

    if (droite.trajectoire.x !== 0) {
    	if (droite.trajectoire.y !== 0) {
	        mDroite = droite.trajectoire.y / droite.trajectoire.x;
	        cDroite = droite.position.y - mDroite * droite.position.x;
	        mPerpendiculaire = -1 / mDroite;
	        cPerpendiculaire = a.y - mPerpendiculaire * a.x;
	        xIntersection = (cPerpendiculaire - cDroite) / (mDroite - mPerpendiculaire);
	        yIntersection = mDroite * xIntersection + cDroite;
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

function isOverLimit(point){
	if (point.x>=-rayon && point.x<=DIMENSION.width+rayon && point.y>=-rayon && point.y<=DIMENSION.height+rayon){
		return false;
	}
	return true;
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