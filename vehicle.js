var mr = 0.01;
function Vehicle(x,y,dna){

    this.acceleration = createVector(0,0);
    this.velocity = createVector(-2,0);
    this.position = createVector(x,y);
    this.r = 6;
    this.maxspeed = 5;
    this.maxforce = 0.5;

    this.dna = [];
    if(dna === undefined){
      // Food weight
      this.dna[0] = random(-2,2);
      // Poison weight
      this.dna[1] = random(-2,2);
      // Food perception
      this.dna[2] = random(0,100);
      // Poison perception
      this.dna[3] = random(0,100);
    } else {
      this.dna[0] = dna[0];
      if(random(1) < mr){
        this.dna[0] += random(-0.1,0.1);// change 1 percent
      }
      // Poison weight
      this.dna[1] = dna[1];
      if(random(1) < mr){
        this.dna[1] += random(-0.1,0.1);// change 1 percent
      }
      // Food perception
      this.dna[2] = dna[2];
      if(random(1) < mr){
        this.dna[2] += random(-10,10);// change 1 percent
      }
      // Poison perception
      this.dna[3] = dna[3];
      if(random(1) < mr){
        this.dna[3] += random(-10,10);// change 1 percent
      }
    }
    // Method to update location
    this.health = 1;
    this.applyForce = function(force){
        this.acceleration.add(force);
    }

}

Vehicle.prototype.dead = function() {
  return (this.health < 0);
}

Vehicle.prototype.clone = function(){
  var newVehicle = new Vehicle (this.position.x,this.position.y, this.dna);
  if(random(1) < 0.01){
    return newVehicle;
  }
  return null;
}


Vehicle.prototype.update = function(){
    // Update velocity
    this.health -= 0.001;
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);

    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
}

Vehicle.prototype.behaviors = function(good, bad){
  var SteerG = this.eat(good,0.2,this.dna[2]);
  var SteerB = this.eat(bad,-0.75,this.dna[3]);


  SteerG.mult(this.dna[0]);
  SteerB.mult(this.dna[1]);

  this.applyForce(SteerG);
  this.applyForce(SteerB);

}


Vehicle.prototype.eat = function(list, nitrition, perception){
    var record = Infinity;
    var closest = null;
    for( var i  = 0 ;i < list.length;i++){// food or posion
        // var d = dist (this.position.x,this.position.y, list[i].x,list[i].y);
        var d = this.position.dist(list[i]);
        if(d < this.maxspeed){// eat food or eat posion
            list.splice(i,1);
            this.health += nitrition;
        }
        if(record > d && d < perception){
            record = d;
            closest = list[i];
        }
    }

    if(closest != null){// find the food or the posion nearly

        return  this.seek(closest);

    }
    return createVector(0,0);
}


Vehicle.prototype.seek = function(target){

    var desired = p5.Vector.sub(target, this.position);

    desired.setMag(this.maxspeed);// change the location limied by this.maxspeed

    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);

    return steer;

}

Vehicle.prototype.display = function() {

    var theta = this.velocity.heading() + PI/2;
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    if(debug.checked()){
      noFill();
      stroke(0,255,0);
      line(0,0,0,-Math.abs(this.dna[0]*20));
      ellipse(0,0,this.dna[2]*2);
      stroke(255,0,0);
      line(0,0,0,Math.abs(this.dna[1]*20));
      ellipse(0,0,this.dna[3]*2);
    }

    var gr = color(0,255,0);// green
    var rd = color(255,0,0);// red
    var col = lerpColor(rd,gr, this.health);

    fill(col);
    stroke(col);
    strokeWeight(0);
    beginShape();
    vertex(0,-this.r*2);
    vertex(-this.r,this.r*2);
    vertex(this.r,this.r*2);
    endShape();
    pop();

}
// A force to keep it on screen
Vehicle.prototype.boundaries = function() {
  var d = 10;
  var desired = null;
  if (this.position.x < d) {
    desired = createVector(this.maxspeed, this.velocity.y);
  } else if (this.position.x > width - d) {
    desired = createVector(-this.maxspeed, this.velocity.y);
  }

  if (this.position.y < d) {
    desired = createVector(this.velocity.x, this.maxspeed);
  } else if (this.position.y > height - d) {
    desired = createVector(this.velocity.x, -this.maxspeed);
  }

  if (desired !== null) {
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
}
