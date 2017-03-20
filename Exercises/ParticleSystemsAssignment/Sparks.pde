
class Sparks extends ParticleSystem {
  Sparks (PVector position, color pc, int ps, int pl, float m, PVector g, boolean a, float ts) {
    super(position, pc, ps, pl, m, g, a, ts);
  }

  void addParticle() {
    // Change the way physics affect the particles according to the project state
    if(isOnFire) {
      gravity = new PVector(0,0);
      lifespan = 10000;
      mass = 20;
    }
    else {
      gravity = new PVector(0,0.02);
      lifespan = 1000;
      mass = 5;
    }
    
    origin = new PVector(random(width/2-50, width/2+50), random(height/2-50, height/2+50));
    
    velocity.add(acceleration);
    velocity.limit(topspeed);
    origin.add(velocity);

    particles.add(new Particle(origin, pColor, size, lifespan, mass, gravity, attractable));
  }
}