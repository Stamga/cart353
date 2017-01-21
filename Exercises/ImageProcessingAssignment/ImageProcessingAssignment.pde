/*
Gabriel St-Amant
Image Processing tool
Techniques inspired by Daniel Shiffman's Learning Processing (Second Edition), Chapter 15 - Images
*/

Effect image;
PImage image_2;

void setup() {
  size(533, 533);
  image = new Effect(loadImage("image_gab.png"));
  image_2 = loadImage("image_synthesis.png");
}

void draw() {
  background(0);
  image.update();
  image(image_2, 0, 0);
}

void mouseClicked() {
  save("saved_image.jpg");
}