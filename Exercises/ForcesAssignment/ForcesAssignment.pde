/* BLOBBY - GABRIEL ST-AMANT
USE ARROW KEYS TO MOVE ATTRACTOR AND COLLECT BUBBLES.

Code inspired by exercises 5 and 8 of Nature of Code, chapter 2.
*/

Attractor attractor;
Bubble[] bubbles = new Bubble[100];

void setup() {
   size(1200, 800); 
  // Create attractor and bubbles
   attractor = new Attractor(1, 1200/2, 800/2);
   for (int i = 0; i < bubbles.length; i++) {
    bubbles[i] = new Bubble(random(0.3, 0.7), random(width), random(height)-100);
  }
}

void draw() {
  background(50,100,200);
  displayMap();
  attractor.checkEdges();
  controls();
  // Compares bubbles with attractor and triggers movements accordingly
  for (Bubble b : bubbles) {
    PVector f = attractor.attract(b);
    b.applyForce(f);
    b.checkEdges();
    b.update();
    b.display();
  }
  attractor.update();
  attractor.display();
}

// Checks for keypress and moves attractor accordingly
void controls() {
  if (keyPressed == true) {
    if (keyCode == UP) {
      attractor.applyForce(new PVector(0, -0.05));
    }
    if (keyCode == DOWN) {
      attractor.applyForce(new PVector(0, 0.05));
    }
    if (keyCode == LEFT) {
      attractor.applyForce(new PVector(-0.05, 0));
    }
    if (keyCode == RIGHT) {
      attractor.applyForce(new PVector(0.05, 0));
    } 
  }
}

// Generates the map visuals
void displayMap() {
  fill(255, 216, 141);
  rect(0, height-50, width, 50); 
  fill(168, 235, 255);
  rect(0, 0, width, 200); 
}