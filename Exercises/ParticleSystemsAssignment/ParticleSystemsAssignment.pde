/* COMET - GABRIEL ST-AMANT
CLICK ANYWHERE TO TURN INTO BLACK HOLE AND CLICK AGAIN TO REVERT.

Code inspired by exercise 4 of Nature of Code, chapter 2.
*/


ParticleSystem comet;
ParticleSystem stars;
ParticleSystem sparks;
ParticleSystem blackHole;

boolean isOnFire;

void setup() {
  size(1000,600);
  // Create particle systems (origin, color, size, lifespan, mass, gravity, attractable, topspeed)
  comet = new Comet(new PVector(width/2,height/2), color(255, 212, 0), 30, 255, 1, new PVector(0,0.01), false, 10);
  stars = new Stars(new PVector(width/2,height/2), color(255), 3, 1000, 100, new PVector(0,0.01), false, 10);
  sparks = new Sparks(new PVector(width/2,height/2), color(255, 100, 100), 5, 1000, 5, new PVector(0,0.02), true, 100);
  blackHole = new BlackHole(new PVector(width/2,height/2), 50, 50, 255, 1, new PVector(0,0), false, 10);
}

void draw() {
  // Change background and switch comet with blackhole, according to state
  if(!isOnFire) {
    background(30,50,70,10);
    comet.addParticle();
  }else {
    background(20,30,70,10);
    blackHole.addParticle();
  }
  // Create and run particles 
  stars.addParticle();
  stars.run();
  sparks.addParticle();
  sparks.run();
  blackHole.run();
  comet.run();
}

void mouseClicked() {
  // Toggle between states
  isOnFire = !isOnFire;
}