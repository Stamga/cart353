/*
Gabriel St-Amant
Random Video
Uses video camera to paint light onto canvas, mixed with gaussian noise and perlin-based motion.
Change cursor position to adjust level of turbulence.
*/
import processing.video.*;

Capture video;

float xOff;
float yOff;
float xTurbulence;
float yTurbulence;

PImage imageCamera;
PImage imageNoise;

void setup() {
  size(640, 480, P3D); 
  imageCamera = createImage(width, height, RGB);
  imageNoise = createImage(width, height, RGB);
  // Begin capturing video
  video = new Capture(this, width, height);
  video.start();
}

void draw() {
  
  // Increment perlin noise offset values 
  xOff += 0.01;
  yOff += 0.02;
  
  // Adjust image turbulence mouvement value 
  xTurbulence = map(mouseX, 0, width, 50, 250);
  yTurbulence = map(mouseY, 0, height, 50, 250);
  
  // Load video pixels
  video.loadPixels();
  for (int x = 0; x < width; x++ ) {
    for (int y = 0; y < height; y++ ) {
      int loc = x + y*width;
      
      // Set imageCamera to video pixels
      imageCamera.pixels[loc] = video.pixels[loc]; 
      
      // Set imageNoise colors to random gaussian values
      int r = int(constrain(abs(randomGaussian()*255), 0, 255));
      int g = int(constrain(abs(randomGaussian()*255), 0, 255));
      int b = int(constrain(abs(randomGaussian()*255), 0, 255));
      imageNoise.pixels[loc] = color(r, g, b); 
    }
  }
  imageCamera.updatePixels();
  imageNoise.updatePixels();
  
  // Set turbulance values using perlin noise
  float xnoise = noise(xOff*1.5, yOff)*xTurbulence-xTurbulence/2;
  float ynoise = noise(xOff*0.8, yOff*1.2)*yTurbulence-yTurbulence/2;
  
  // Add semi-transparency for fuzzy effect
  tint(255, 1);
  image(imageNoise, 0, 0);
  tint(255, 3);
  image(imageCamera, xnoise, ynoise);
}