class Clone extends Boule{
	constructor(retard){
		super("red");
		this.retard = retard;
		this.nextFrame();
	}

	nextFrame(){
		this.position = historiquePosition[historiquePosition.length - this.retard - 1];
		if (this.position !== undefined){
			this.draw();
			this.setGameOver();
		}
	}
}