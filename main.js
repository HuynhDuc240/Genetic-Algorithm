var food = [];
var poison = [];
var numOffood = 150;
var numOfpoison = 100;
var vehicle = [];
var numOfvehicle = 500;
var debug;
function setup() {
	createCanvas(windowWidth, windowHeight-25);
	background(51);
	for (var  i =0 ;i < numOfvehicle;i++){
			var w = random(width);
			var h = random(height);
			vehicle[i] = new Vehicle (w,h);
	}

	for (var i =0 ; i< numOffood ;i++){
		var x = floor(random(width));
		var y = floor(random(height));
		food.push(createVector(x,y));
	}
	for ( var i = 0; i < numOfpoison; i++ ){
		var x = floor(random(width-50));
		var y = floor(random(height-50));
		poison.push(createVector(x,y));
	}
	debug = createCheckbox();
}

function draw() {
	background(51);
 	if(random(1) < 0.05){
		var x = floor(random(width));
		var y = floor(random(height));
		food.push(createVector(x,y))
	}


	if(random(1) < 0.01){
		var x = floor(random(width));
		var y = floor(random(height));
		poison.push(createVector(x,y))
	}

	for(var i = 0;i<food.length;i++){
		fill(0,255,0);
		noStroke();
		ellipse(food[i].x,food[i].y,8,8);
	}

	for(var i = 0;i<poison.length;i++){
		fill(255,0,0);
		noStroke();
		ellipse(poison[i].x,poison[i].y,8,8);
	}
	for (var  i = 0 ; i < vehicle.length;i++){
		vehicle[i].boundaries();
		vehicle[i].behaviors(food, poison);
		vehicle[i].update();
		vehicle[i].display();

		if(random(1) < 0.05){
			var newVehicle = vehicle[i].clone();
			if(newVehicle != null){
			  vehicle.push(newVehicle);
		  }
		}
		if(vehicle[i].dead()){
			var x = vehicle[i].position.x;
			var y = vehicle[i].position.y;
			food.push(createVector(x,y));
			vehicle.splice(i,1);
		}
	}
}
