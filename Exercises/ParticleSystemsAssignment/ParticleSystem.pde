class ParticleSystem {
  ArrayList<Particle> particles;
  
  PVector origin;
  PVector velocity;
  PVector acceleration;
  PVector gravity;
  float topspeed;
  float xoff;
  float yoff;
  color pColor;
  int size;
  int lifespan;
  float mass;
  boolean attractable;

  ParticleSystem(PVector position, color pc, int ps, int pl, float m, PVector g, boolean a, float ts) {
    origin = position.get();
    velocity = new PVector(0, 0);
    acceleration = new PVector(0, 0);
    pColor = pc;
    size = ps; 
    lifespan = pl;
    mass = m;
    gravity = g;
    attractable = a;
    topspeed = ts;
    xoff = 0.0;
    yoff = 1000;

    particles = new ArrayList<Particle>();
  }

  void addParticle() {
    velocity.add(acceleration);
    velocity.limit(topspeed);
    origin.add(velocity);

    particles.add(new Particle(origin, pColor, size, lifespan, mass, gravity, attractable));
  }

  void run() {
    // Reverse for loop to delete dead particles
    for (int i = particles.size() -1; i >=0 ; i--) {
      Particle p = particles.get(i);
      if (p.isDead()) {
        particles.remove(i);
      }
    }
    
    // Enhanced for loop to run/display particles in right order (order of creation)
    for (Particle p : particles) {
      p.run();
    }
  }
}