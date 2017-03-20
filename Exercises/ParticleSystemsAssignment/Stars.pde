
class Stars extends ParticleSystem {
  Stars (PVector position, color pc, int ps, int pl, float m, PVector g, boolean a, float ts) {
    super(position, pc, ps, pl, m, g, a, ts);
  }
  
  void addParticle() {
    // Change the way physics affect the particles according to the project state
    if(isOnFire) {
      gravity = new PVector(0,0);
      attractable = true;
    }
    else {
      gravity = new PVector(0,0.01);
      attractable = false;
    }
    
    origin = new PVector(random(width), 0);

    velocity.add(acceleration);
    velocity.limit(topspeed);
    origin.add(velocity);

    particles.add(new Particle(origin, pColor, size, lifespan, mass, gravity, attractable));
  }
}