/*----------------------------------------- VARIABLE GLOBAL ---------------------------------------------------*/

var positionSouris;
var canvas = document.getElementById("jeuCanvas");
var context =  canvas.getContext('2d');
var historiquePosition = [];
var pause = false;
var gameOver = false;
var rayon = 25;
var listeBoule = [];
var listeClone = [];
var frame = 0;
var score = 0;

document.addEventListener('mousemove', eventDeplacementSouris);
document.addEventListener('touchmove', eventDeplacementDoigt);
document.addEventListener('touchstart', function(event) {switchPause(false);});
document.addEventListener('mouseleave', function(event) {
	switchPause(true);
});
canvas.addEventListener('click', eventClic);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DIMENSION = canvas.getBoundingClientRect();

/*----------------------------------------- EVENEMENTS ---------------------------------------------------*/

function eventClic(event){
	if (getDistance(positionSouris,historiquePosition[historiquePosition.length-1]) <= rayon){
		switchPause();
	}
}
function eventDeplacementSouris(event){
	positionSouris = {
		'x':event.clientX - DIMENSION.left,
		'y': event.clientY - DIMENSION.top
	};
}

function eventDeplacementDoigt(event){
	touch = event.touches[0];
	positionSouris = {
		'x': touch.clientX - DIMENSION.left,
		'y': touch.clientY - DIMENSION.top
	};
	positionSouris.x = (positionSouris.x - DIMENSION.width/2)*2;
	if (positionSouris.x < 0){
		positionSouris.x = 0;
	}
	positionSouris.y = (positionSouris.y - 3*DIMENSION.height/4)*4;
	if (positionSouris.y < 0){
		positionSouris.y = 0;
	}
}

function switchPause(etat=null){
	if (etat !== false && etat !== true){
		etat = !pause;
	}
	if (pause !== etat){
		pause = etat;
		if (!gameOver){
			if (pause){
				context.fillStyle = "rgba(0,0,0,0.5)";
				context.fillRect(0,0,DIMENSION.width, DIMENSION.height);
				context.fillStyle = "black";
				context.font = "48px serif";
				context.fillText("Click on the green circle to play !", DIMENSION.width/2-350, DIMENSION.height/2);
				drawBall(historiquePosition[historiquePosition.length-1], "#BADA55");
			}
			else{
				boucle();
			}
		}
	}
}


/*----------------------------------------- BOUCLE ---------------------------------------------------*/

function update(){
	context.fillStyle = "rgba(255,255,255,0.25)";
	context.fillRect(0,0,DIMENSION.width, DIMENSION.height);
	historiquePosition.push(positionSouris);
	drawBall(historiquePosition[historiquePosition.length-1], "#BADA55");

	if (frame >= 60){
		frame = 0;
		score ++;
	}
	if (score > 0){
		while (listeBoule.length < 5+(score/2)){
			listeBoule.push(newBoule());
		}
		listeClone.forEach(function(clone, index) {clone.nextFrame()});
		listeBoule.forEach(function(boule, index) {
			if (boule.nextFrame() === false){
				listeBoule[index] = newBoule();
			}
		});
	}

	if (historiquePosition.length > 301){
		var anciennePosition = historiquePosition.shift();
	}
  	context.fillText(score, 10, 50);
}
function boucle(){
	if (!pause && !gameOver){
		update();
		frame ++;
		requestAnimationFrame(boucle);
	}
}

function start(){
	positionSouris = {'x':DIMENSION.width/2, 'y':DIMENSION.height/2};
	historiquePosition.push(positionSouris);
	switchPause(true);
	listeClone = [new Clone(100),new Clone(200),new Clone(300)];
	boucle();
}

start();