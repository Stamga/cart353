
class BlackHole extends ParticleSystem {
  BlackHole (PVector position, color pc, int ps, int pl, float m, PVector g, boolean a, float ts) {
    super(position, pc, ps, pl, m, g, a, ts);
  }
  
  // Create particles with additional randomness
  void addParticle() {
    origin = new PVector(width/2-random(-10,10), height/2-random(-10,10));
    
    velocity.add(acceleration);
    velocity.limit(topspeed);
    origin.add(velocity);

    particles.add(new Particle(origin, pColor, size, lifespan, mass, gravity, attractable));
  }
  
}