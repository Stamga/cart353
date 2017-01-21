class Effect {
  PImage source;
  PImage destination;
  float opacity;
  float tintR;
  float tintG;
  float tintB;

  Effect (PImage source) {
    this.source = source; 
    this.destination = createImage(source.width, source.height, RGB);
  }

  void update() {
    destination.updatePixels();
    deconstructImage();
    setTint();
    image(destination, 0, 0);
  }
  
  void deconstructImage() {
    /*
    Mixes original color values with random colors,
    to add noise texture with opacity based on mouse X position.
    */
    source.loadPixels();
    destination.loadPixels();
    opacity = map(mouseX, 0, width, 0, 100);
    for (int x = 0; x < source.width; x++) {
      for (int y = 0; y < source.height; y++) {
        int loc = x + y*source.width;
        // Change color opacity based on mouse X
        float sourceR = red(source.pixels[loc])*opacity/100;
        float sourceG = green(source.pixels[loc])*opacity/100;
        float sourceB = blue(source.pixels[loc])*opacity/100;
        // Average between source colors and random
        float destR = (sourceR + random(255))/2;
        float destG = (sourceG + random(255))/2;
        float destB = (sourceB + random(255))/2;
        destination.pixels[loc] = color(destR, destG, destB);
      }
    } 
  }
  
  void setTint() {
    /*
      Cycles through predefined color tints based on mouse Y position.
    */
    tintR = map(mouseY, 0, height, 0, 200)+55;
    tintG = map(mouseY, 0, height, 255, 0);
    tintB = map(mouseY, 0, height, 50, 200)+55;
    tint(tintR, tintG, tintB);
    blendMode(ADD);
  }
}