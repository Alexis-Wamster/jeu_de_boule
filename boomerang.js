class Boomerang extends Boule{
	constructor(){
		super("orange");
		this.rayon = Math.random()*20+15;
		this.origine = historiquePosition[0];
		this.inclinaison = Math.random()**2;
		this.maxX = 100*(1/((this.inclinaison+0.01)*2));
		this.x = -this.maxX;
		this.vitesse = (1/((this.inclinaison+0.01)*10));
		this.position = this.calculPosition();
		this.angle = Math.random()*360;
	}

	nextFrame(){
		this.x += this.vitesse;
		this.position = symetrieCentrale(this.calculPosition(), this.origine, this.angle);
		this.draw();
		this.setGameOver();
		if (this.x > this.maxX){
			return false;
		}
		return true;
	}

	calculPosition(){
		var y = (this.inclinaison*this.x)**2;
		return {
			'x':this.x + this.origine.x,
			'y': y + this.origine.y
		};
	}
}

function degToRad(degre) {
  return degre * Math.PI / 180;
}


function symetrieCentrale(a, o, angle) {
  var radian = degToRad(angle);
  var oa = subPoint(a,o);
  return {
  	'x': oa.x * Math.cos(radian) - oa.y * Math.sin(radian) + o.x,
  	'y': oa.x * Math.sin(radian) + oa.y * Math.cos(radian) + o.y
  }
}