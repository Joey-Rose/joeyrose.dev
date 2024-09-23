const gravity = 0.01;
const bounce = 0.7;

class Ball {
  constructor() {
    this.x = document.documentElement.clientWidth / 2;
    this.y = 100;
    this.vx = 5;
    this.vy = 1;
    this.radius = 15;
  }

  move(width, height) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;

    // check for any line collisions
    for (let index = 0; index < lines.length; index++) {
      let line = lines[index];

      if (this.radius > pointToSegmentDistance(this.x, this.y, line.fromXY.x, line.fromXY.y, line.toXY.x, line.toXY.y)) {
        // lit has been hit. TODO: change x and y velocity here
        console.log("line has been hit. minX is ", line.minX, "maxX is ", line.maxX, "angle is ", line.angle);
        let result = this.reflectVelocity(line.angle);
        let newVx = result[0];
        let newVy = result[1];  
        
        console.log("new vx is ", newVx, " new vy is", newVy);
        this.vx = newVx;
        this.vy = newVy;

        this.x += this.vx;
    this.y += this.vy;

        // this.x = document.documentElement.clientWidth / 2;
        // this.y = 100;
      }
    }
    
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

  reflectVelocity(thetaInRadians) {
    console.log("theta is ", thetaInRadians);
    
    // Decompose the velocity into tangential and normal components
    let v_t = this.vx * Math.cos(thetaInRadians) + this.vy * Math.sin(thetaInRadians);   // Tangential velocity
    let v_n = -this.vx * Math.sin(thetaInRadians) + this.vy * Math.cos(thetaInRadians);  // Normal velocity
  
    // Reflect the normal component (reverse its direction)
    v_n = -v_n;
  
    // Recompose the new velocity
    let newVx = Math.floor(v_t * Math.cos(thetaInRadians) + v_n * Math.sin(thetaInRadians));
    let newVy = Math.floor(v_t * Math.sin(thetaInRadians) - v_n * Math.cos(thetaInRadians));
  
    return [ newVx, newVy * -1 ];
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
    this.minX = fromXY.x < toXY.x ? fromXY : toXY;
    this.maxX = fromXY.x > toXY.x ? fromXY : toXY;
    this.angle = Math.atan2(
      this.minX.y - this.maxX.y, // opposite since y is positive in downward direction
      this.maxX.x - this.minX.x
    );
    // this.midX = (toXY.x + fromXY.x) / 2;
    // this.midY = (toXY.y + fromXY.y) / 2;
    // this.sine = Math.sin(this.angle);
    // this.cosine = Math.cos(this.angle);
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

function pointToSegmentDistance(x0, y0, x1, y1, x2, y2) {
  let A = x0 - x1;
  let B = y0 - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  
  if (len_sq != 0) { // in case of zero length line
      param = dot / len_sq;
  }

  let xx, yy;

  if (param < 0) {
      xx = x1;
      yy = y1;
  } else if (param > 1) {
      xx = x2;
      yy = y2;
  } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
  }

  let dx = x0 - xx;
  let dy = y0 - yy;
  return Math.sqrt(dx * dx + dy * dy);
}