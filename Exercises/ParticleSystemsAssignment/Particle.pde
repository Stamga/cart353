class Particle {
  PVector position;
  PVector velocity;
  PVector acceleration;
  float lifespan;
  int size;
  float mass;
  color pColor;
  PVector gravity;
  boolean attractable;

  Particle(PVector l, color pc, int ps, int pl, float m, PVector g, boolean a) {
    acceleration = new PVector(0,0);
    velocity = new PVector(random(-0.2,0.2),random(-0.2,0.2));
    position = l.get();
    pColor = pc;
    lifespan = pl;
    size = int(random(ps/10,ps));
    mass = m;
    gravity = g;
    attractable = a;
  }

  void run() {
    // Run functions depending if attractable or not
    if(attractable) {
      attract();
    }
    applyForce(gravity);
    update();
    display();
  }
  
  void applyForce(PVector force) {
    PVector f = PVector.div(force, mass);
    acceleration.add(f);
  }
  
  void attract() {
    // Get attracted or repulsed depending on project state
    PVector force = PVector.sub(comet.origin, position);
    float d = force.mag();
    float strength = 0;
    if(isOnFire) {
      if(d > 30) {
        d = constrain(d, 10.0, 60.0);
        force.normalize();
        strength =  100 / (d * d);
      }
    }
    else {
      d = constrain(d, 15.0, 60.0);
      force.normalize();
      strength = -10 / (d * d);
    }
    force.mult(strength);
    applyForce(force);
  }
  
  void update() {
    velocity.add(acceleration);
    velocity.limit(3);
    position.add(velocity);
    lifespan -= 2.0;
  }

  void display() {
    noStroke();
    fill(red(pColor), green(pColor)-(255-lifespan), blue(pColor), lifespan);
    ellipse(position.x,position.y,size,size);
  }
  
  void setColor(color c) {
    pColor = c;
  }
  
  void setGravity(PVector g) {
    gravity = g;
  }
  
  // Is the particle still useful?
  boolean isDead() {
    if (lifespan < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}