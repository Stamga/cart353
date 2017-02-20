class Bubble extends Element {
  
  Bubble(float m, float x, float y) {
    super(m, x, y);
  }
  void display() {
    noStroke();
    fill(fillColor);
    ellipse(position.x, position.y, mass*25, mass*25);
  }
  
  void changeColor(color newColor) {
    fillColor = newColor;
  }
}