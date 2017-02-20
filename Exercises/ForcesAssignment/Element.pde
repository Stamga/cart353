class Element {
  
  PVector position;
  PVector velocity;
  PVector acceleration;
  float mass;
  color fillColor = color(255, 100);
  
  Element(float m, float x, float y) {
    mass = m;
    position = new PVector(x, y);
    velocity = new PVector(0, 0);
    acceleration = new PVector(0, 0);
  }
  
  // Combines motion variables to create movement
  void update() {
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0);
  }
  
  // Applies defined force to element
  void applyForce(PVector force) {
    PVector f = PVector.div(force, mass);
    acceleration.add(f);
  }
  
  // Verifies ocean, sand and sky delimitations and applies forces/frictions accordingly
  void checkEdges() {
    if (position.y > height) {
      position.y = height;
      velocity.y *= -0.5;
    }else if (position.y > height-55) {
      setFriction(0.1);
    }else if (position.y < 200) {
      applyForce(new PVector(0, 0.1));
    }else {
      setFriction(0.0001);
      applyForce(new PVector(0, -0.01));
    }
    if (position.x > width+50) {
      applyForce(new PVector(-0.1, 0));
    }else if (position.x < -50) {
      applyForce(new PVector(0.1, 0));
    } 
  }
  
  // Adds friction to slow down movement
  void setFriction(float c) {
    float area = mass * 16 * 0.1;
    
    float speed = velocity.mag();
    float dragMagnitude = c * speed * speed * area;

    PVector dragForce = velocity.get();
    dragForce.mult(-1);
    
    dragForce.normalize();
    dragForce.mult(dragMagnitude);
    applyForce(dragForce);
  }
  
}