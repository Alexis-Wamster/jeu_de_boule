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
var frame = 0;
var score = 0;


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
		updateClone();
		if (historiquePosition.length > 301){
			var anciennePosition = historiquePosition.shift();
		}
		updateBall();
		if (listeBall.length < 5){
			createBall();
		}
		updateFantome();
		if (listefantome.length < 5){
			createFantome();
		}
	}

	context.font = "48px serif";
  	context.fillText(score, 10, 50);
}
function boucle(){
	update();
	frame ++;
	if (!pause && !gameOver){
		requestAnimationFrame(boucle);
	}
}

boucle();