const gravity = 0.5;
const bounce = 0.7;

class Ball {
  constructor() {
    this.x = document.documentElement.clientWidth / 2;
    this.y = 100;
    this.vx = 5;
    this.vy = 15;
    this.radius = 15;
  }

  move(width, height) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;

    // if either wall is hit, change direction on x axis
    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.vx *= -1;
    }

    // ball hits the floor
    if (this.y + this.radius > height) {
      // re-position the ball to be exactly on the bottom of the window
      this.y = height - this.radius;

      // bounce the ball
      this.vy *= -bounce;
      // if the velocity of the vertical bounce of the ball is super small, set it to 0. Otherwise, the ball will never stop bouncing
      if (this.vy < 0 && this.vy > -2.1) this.vy = 0;
    }
  }

  display() {
    context.fillStyle = "black";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }
}

class Line {
  fromXY = {};
  toXY = {};
  constructor(fromXY, toXY) {
    this.fromXY.x = fromXY.x;
    this.fromXY.y = fromXY.y;
    this.toXY.x = toXY.x;
    this.toXY.y = toXY.y;
    this.minX = Math.min(toXY.x, fromXY.x);
    this.maxX = Math.max(toXY.x, fromXY.x);
    this.angle = Math.atan2(
      Math.abs(toXY.y - fromXY.y),
      Math.abs(toXY.x - fromXY.x)
    );
    this.midX = (toXY.x + fromXY.x) / 2;
    this.midY = (toXY.y + fromXY.y) / 2;
    this.sine = Math.sin(this.angle);
    this.cosine = Math.cos(this.angle);
  }

  display() {
    context.beginPath();
    context.moveTo(this.fromXY.x, this.fromXY.y);
    context.lineTo(this.toXY.x, this.toXY.y);
    context.stroke();
    context.closePath();
  }
}

var context = document.querySelector("canvas").getContext("2d");

// logic for creating lines!
let fromXY = {};
let toXY = {};
document.onclick = clickHandler;
document.onmousemove = decideLineHandler;

var balls = new Array();
var lines = new Array();

for (let index = 0; index < 1; index++) {
  balls.push(new Ball());
}

loop();

function loop() {
  window.requestAnimationFrame(loop);

  let height = document.documentElement.clientHeight;
  let width = document.documentElement.clientWidth;

  context.canvas.height = height;
  context.canvas.width = width;

  // display balls
  for (let index = 0; index < balls.length; index++) {
    let ball = balls[index];

    ball.display();
    ball.move(width, height);
  }

  // if user is picking where to put line, draw this change
  if (typeof fromXY.x !== "undefined") {
    drawLineUpdates();
  }

  // display lines
  for (let index = 0; index < lines.length; index++) {
    let line = lines[index];
    line.display();
  }
}

function clickHandler(e) {
  // if you haven't yet created a starting point for the line, make one!
  console.log("click happened");
  if (typeof fromXY.x === "undefined") {
    console.log("updating vals");
    fromXY.x = e.clientX;
    fromXY.y = e.clientY;
  }
  // if you're adding the ending point for the line, add start/end points to the array of line start/end points
  // then, reset the start/end points
  else {
    console.log(JSON.stringify(fromXY));
    console.log(JSON.stringify(toXY));
    lines.push(new Line(fromXY, toXY));
    resetLinePoints();
  }
}

function decideLineHandler(e) {
  // if the line has a starting point, update the end values for the line, and draw the line updates in real time
  if (typeof fromXY.x !== "undefined") {
    console.log("updating line");
    toXY.x = e.clientX;
    toXY.y = e.clientY;

    // let the line drawing updates happen naturally via the draw() function
  }
}

function resetLinePoints() {
  fromXY = {};
  toXY = {};
}

function drawLineUpdates() {
  context.beginPath();
  context.moveTo(fromXY.x, fromXY.y);
  context.lineTo(toXY.x, toXY.y);
  context.stroke();
  context.closePath();
}
