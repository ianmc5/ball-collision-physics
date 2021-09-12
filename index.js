const c = document.getElementById("canvas1");
const ctx = c.getContext("2d");
const width = ctx.canvas.width = 500;
const height = ctx.canvas.height = 500;

const g = 1;
var particleArray = [];
var amount = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;
var colliding;
var mx, my;
var canSpawn = true;
var squareDist;
function text() {
  document.getElementById("amount").innerHTML = ("balls: " + amount);
}

function toRadians(angle) {
  return (angle) * (Math.PI / 180);
}


// particle prototype
function Particle(x, y, v, angle, r, m, cor, color) {
  this.x = x;
  this.y = y;
  this.v = v;
  this.angle = angle;
  this.vx = (this.v * Math.cos(this.angle));
  this.vy = (this.v * Math.sin(this.angle));
  this.r = r;
  this.m = m;
  this.color = color;
  this.cor = cor;
}

Particle.prototype.draw = function() {
//circle
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
}

Particle.prototype.wallCollide = function() {
//left and right
  if (this.x > width - this.r) {
    this.vx = -Math.abs(this.vx) * this.cor;
    this.x = width - this.r;

  }else if (this.x < this.r) {
    this.vx = Math.abs(this.vx) * this.cor;
    this.x = this.r;
  }

// top and bottom
  if (this.y > height - this.r) {
    this.vy = -Math.abs(this.vy) * this.cor;
    this.y = height - this.r;

  }else if(this.y < this.r) {
    this.vy = Math.abs(this.vy) * this.cor;
    this.y = this.r;
  }
}




function collision() {
//for every particle check if colliding with every particle
  for (let i=0; i<particleArray.length; i++) {
    for (let j = i+1; j < particleArray.length; j++) {
//if intersecting on x axis
      if((particleArray[i].x + particleArray[i].r) > (particleArray[j].x - particleArray[j].r) && (particleArray[i].x - particleArray[i].r) < (particleArray[j].x + particleArray[j].r)) {
//check if colliding
        squareDist = ((particleArray[j].x-particleArray[i].x)*(particleArray[j].x-particleArray[i].x))+((particleArray[j].y-particleArray[i].y)*(particleArray[j].y-particleArray[i].y));

        if (squareDist <= ((particleArray[j].r+particleArray[i].r) * (particleArray[j].r+particleArray[i].r))){

          collide(particleArray[i].x, particleArray[i].y, particleArray[i].r, particleArray[i].m, particleArray[i].vx, particleArray[i].vy, particleArray[i].cor, particleArray[j].x, particleArray[j].y, particleArray[j].r, particleArray[j].m, particleArray[j].vx, particleArray[j].vy, particleArray[j].cor, i, j);
        }
      }
    }
    particleArray[i].wallCollide();
  }
}




function collide(x1, y1, r1, m1, vx1, vy1, cor1, x2, y2, r2, m2, vx2, vy2, cor2, i, j) {
  let vCollision = {x: x2 - x1, y: y2 - y1};
  let d = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
  let vCollisionNorm = {x: vCollision.x / d, y: vCollision.y / d};
  let vRelativeVelocity = {x: vx1 - vx2, y: vy1 - vy2};

  let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
  speed *= Math.min(cor1, cor2);
  let impulse = 2 * speed / (m1 + m2);

  particleArray[i].vx -= (impulse * m2 * vCollisionNorm.x);
  particleArray[i].vy -= (impulse * m2 * vCollisionNorm.y);
  particleArray[j].vx += (impulse * m1 * vCollisionNorm.x);
  particleArray[j].vy += (impulse * m1 * vCollisionNorm.y);

let diff = (r1 + r2) - d;
  particleArray[i].x -= (diff * vCollisionNorm.x);
  particleArray[i].y -= (diff * vCollisionNorm.y);
  particleArray[j].x += (diff * vCollisionNorm.x);
  particleArray[j].y += (diff * vCollisionNorm.y);
//figure out what to do if v = 0
}

Particle.prototype.update = function(secondsPassed) {
  this.vy += g;
  this.x += this.vx * secondsPassed;
  this.y += this.vy * secondsPassed;
}

function square(originX, originY, theRoot, radius, angle, vel, vAngle, colore) {
  let ox = originX;
  let oy = originY;
  let root = theRoot;
  let r = radius;
  let squareAngle = toRadians(angle);
  let cx = ox + ((root * (r * 2.1) + r) / 2);
  let cy = oy + ((root * (r * 2.1) + r) / 2);
  for (let j=0; j<root; j++) {
    for (let i=0; i<root; i++) {
      let m = r;
      let ax = ox + (i * (r * 2.1));
      let ay = oy + (j * (r * 2.1));
      let x = ((ax-cx) * Math.cos(squareAngle)) + ((ay-cy) * Math.sin(squareAngle)) + cx;
      let y = ((ay-cy) * Math.cos(squareAngle)) - ((ax-cx) * Math.sin(squareAngle)) + cy;
      let cor = .7;
      let v = vel;
      let angle = toRadians(vAngle);
      let color = colore;
      particleArray.push(new Particle(x, y, v, angle, r, m, cor, color));
      amount ++
    }
  }
}

//spawn balls
function init(particleAmount){
  for (let i=0; i<particleAmount; i++){
    let r = 20;
    let m = r * 10;
    let x = (Math.random() * 400) + 50;
    let y = (Math.random() * 400) + 50;
    let v = 5;
    let cor = .7;
    let angle = toRadians(Math.random() * 360);
    let color = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
//spawn without colliding
    for (let i=0;i<particleArray.length; i++) {
      if (canSpawn === false) { break; }

      squareDist = ((particleArray[i].x - x)*(particleArray[i].x - x))+((particleArray[i].y - y)*(particleArray[i].y - y));

      if (squareDist <= ((r + particleArray[i].r) * (r + particleArray[i].r))) {
        canSpawn = false;
      } else {
        canSpawn = true;
      }
    }
    if (canSpawn === true) {
      amount ++;
      particleArray.push(new Particle(x, y, v, angle, r, m, cor, color));
    } else {continue;}
  }
}

//animation loop
function loop(timeStamp) {

  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  secondsPassed = Math.min(secondsPassed, 0.1);
  oldTimeStamp = timeStamp;

  for (let i=0; i<particleArray.length; i++) {
    particleArray[i].update(secondsPassed);
  }
  collision();

  ctx.clearRect(0,0, width, height);
  for (let i=0; i<particleArray.length; i++) {
    particleArray[i].draw();
  }
  text();

  window.requestAnimationFrame(loop);
}

square(110, 200, 15, 8, 45, 0, 90, "blue");

//init(100);
requestAnimationFrame(loop);
