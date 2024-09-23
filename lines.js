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
            if (this.x + this.radius > width || this.x - this.radius < 0){
                this.vx *= -1;
            } 
            
                // ball hits the floor
            if (this.y + this.radius > height){
                
                // re-position the ball to be exactly on the bottom of the window
                this.y = height - this.radius;

                // bounce the ball
                this.vy *= -bounce;
                // if the velocity of the vertical bounce of the ball is super small, set it to 0. Otherwise, the ball will never stop bouncing
                if(this.vy<0 && this.vy>-2.1) this.vy=0;            
            }
        }
    }

      var context = document.querySelector("canvas").getContext("2d");

      var balls = new Array();

      for(let index = 0; index < 1; index ++) {
        balls.push(new Ball());

      }

      function loop() {

        window.requestAnimationFrame(loop);

        let height = document.documentElement.clientHeight;
        let width  = document.documentElement.clientWidth;

        context.canvas.height = height;
        context.canvas.width = width;

        for(let index = 0; index < balls.length; index++) {

          let ball = balls[index];

          context.fillStyle = "black";
          context.beginPath();
          context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          context.fill();

          ball.move(width, height);
        }

      }

      loop();
