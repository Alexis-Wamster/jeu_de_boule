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