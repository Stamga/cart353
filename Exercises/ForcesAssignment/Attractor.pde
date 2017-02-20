class Attractor extends Element {

  float gravity = 0.01;
  float resistance = 1;
  
  Attractor(float m, float x, float y) {
    super(m, x, y);
  }
  
  void display() {
    fill(79,255,200);
    noStroke();
    ellipse(position.x, position.y, mass*24, mass*24);
  }
  
  PVector attract(Bubble b) {
    PVector force = PVector.sub(position, b.position);
    float d = force.mag();
    // If in range, trigger force towards attractor & change color, else set force to 0
    if (d < 150) {
      d = constrain(d, 15.0, 60.0);
      force.normalize();
      float strength = (gravity * mass * 20000 * b.mass) / (d * d);
      force.mult(strength);
      b.changeColor(color(79,255,200));
    }else {
      force = new PVector(0,0);
      b.changeColor(color(255, 100));
    }
    return force;
  }
}