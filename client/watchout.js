"use strict";
var boardInfo = {
  width: 800,
  height: 400
};

var scoreBoard = {
  curScore: 0,
  maxScore: 0,
  collisions: 0
};

var Asteroid = function() {
  this.size = Math.random() * 10 + 10;
  this.x = Math.random() * (boardInfo.width-30) + 30;
  this.y = Math.random() * (boardInfo.height-30) + 30;
  this.xv = Math.random() * 3 + 3;
  this.yv = Math.random() * 3 + 3;
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
};

Asteroid.prototype.moveY = function () {
  if (this.y >= boardInfo.height - this.size || this.y <= this.size) {
      this.yv = -1 * this.yv;
    }
  this.y += this.yv;
  return this.y;
};

Asteroid.prototype.moveX = function () {
  if (this.x >= (boardInfo.width - this.size) || this.x <= this.size) {
    this.xv = -1 * this.xv;
  }
  this.x += this.xv;
  return this.x;
};

var Player = function() {
  this.size = 10;
  this.x = 400;
  this.y = 200;
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
};

Player.prototype.changeColor = function () {
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
};

var Shuriken = function() {
  this.points = [[0,5], [14.142,14.142],
                [5,0], [14.142,-14.142],
                [0,-5], [-14.142,-14.142],
                [-5,0], [-14.142,14.142],
                [0,5]];
  this.size = 20;
  this.xv = Math.random() * 2 + 2;
  this.yv = Math.random() * 2 + 2;
  this.x = Math.random() * (boardInfo.width-30) + 30;
  this.y = Math.random() * (boardInfo.height-30) + 30;
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
};

Shuriken.prototype.movePoints = function () {
  var points = "";
  if (this.x >= (boardInfo.width - this.size) || this.x <= this.size) {
    this.xv = -1 * this.xv;
  }
  if (this.y >= (boardInfo.height - this.size) || this.y <= this.size) {
    this.yv = -1 * this.yv;
  }

  this.y += this.yv;
  this.x += this.xv;
  if (this.x > boardInfo.width - this.size) this.x = boardInfo.width - this.size - 1;
  if (this.x < this.size) this.x = this.size + 1;
  if (this.y > boardInfo.height - this.size) this.y = boardInfo.height - this.size - 1;
  if (this.y < this.size) this.y = this.size + 1;
  this.points.forEach((function(point) {
    point = point.slice();
    point[0] += this.x;
    point[1] += this.y;
    points += point.toString() + " ";
  }).bind(this));

  return points;
};

function createObjects(Class, num) {
  var elements = [];
  for(var i = 0; i<num; i+=1) {
    var instance = new Class();
    elements.push(instance);
  }
  return elements;
}

var asteroids = createObjects(Asteroid, 8);
var shurikens = createObjects(Shuriken, 3);
var players = createObjects(Player, 1);

var player1 = players[0];

var svg = d3.select(".board").append("svg")
  .attr("width", boardInfo.width)
  .attr("height", boardInfo.height)
  .attr("fill", "yellow");

var player1D3 = svg.selectAll("circle").data(players)
  .enter().append("circle").attr("r", function(d) {return d.size;})
  .attr("cx", function(d) {return d.x;})
  .attr("cy", function(d) {return d.y;})
  .attr("class", "player")
  .attr("fill", "yellow");

svg.selectAll("circle").data(asteroids)
  .enter().append("circle").attr("r", function(d) {return d.size;})
  .attr("cx", function(d) {return d.x;})
  .attr("cy", function(d) { return d.y;})
  .attr("class", "asteroid")
  .attr("fill", function(d) {return d.color;});

svg.selectAll(".shuriken")
  .data(shurikens)
  .enter()
  .append("polygon")
  .attr("points", function(d) {return d.movePoints();})
  .attr("dx", function(d) {return d.x;})
  .attr("dy", function(d) {return d.y;})
  .attr("class", "shuriken")
  .attr("fill", function(d) {
    return d.color;
  });

// -----------------------------------------------------------

var ctx = new (window.AudioContext || window.webkitAudioContext)();

var osc = ctx.createOscillator();
osc.frequency.value = 800;
osc.type = "square";

var mod = ctx.createOscillator();
mod.type = "square";
mod.frequency.value = 4;

var gain = ctx.createGain();
var scaler = ctx.createGain();

osc.connect(gain);
gain.connect(ctx.destination);

mod.connect(scaler); // 3 beeps per sec
scaler.gain.value = 0.3;
gain.gain.value = 0.3;
scaler.connect(gain.gain);

osc.start(0);
mod.start(0);

// -----------------------------------------------------------

d3.select("svg").on("mousemove", function() {
  var coordinates = d3.mouse(this);
  player1.x = coordinates[0];
  player1.y = coordinates[1];
  player1.changeColor();
  player1D3.attr("cx", coordinates[0])
  .attr("cy", coordinates[1])
  .transition()
  .duration(10)
  .attr("fill", player1.color);
  scoreBoard.curScore++;
});

setInterval(function () {
  d3.selectAll(".asteroid")
  .attr("cx", function(d) {return d.moveX();})
  .attr("cy", function(d) {return d.moveY();})
  .transition()
  .duration(15);

  shurikens.forEach(function(shuriken) {
    if (shuriken.x > player1.x) {
      shuriken.xv -= 0.1;
      if (shuriken.xv < -5) shuriken.xv = -5;
    } else if (shuriken.x < player1.x) {
      shuriken.xv += 0.1;
      if (shuriken.xv > 5) shuriken.xv = 5;
    }
    if (shuriken.y > player1.y) {
      shuriken.yv -= 0.1;
      if (shuriken.xv < -5) shuriken.yv = -5;
    } else if (shuriken.y < player1.y) {
      shuriken.yv += 0.1;
      if (shuriken.yv > 5) shuriken.yv = 5;
    }
  });

  d3.selectAll(".shuriken")
    .attr("points", function(d) {
      return d.movePoints();
    })
    .transition()
    .duration(15);

  if (scoreBoard.curScore > scoreBoard.maxScore) {
    scoreBoard.maxScore = scoreBoard.curScore;
  }
  d3.select(".highscore span")
  .text("" + scoreBoard.maxScore);

  asteroids.forEach(function (asteroid) {
    var dx = asteroid.x - player1.x;
    var dy = asteroid.y - player1.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if(distance < asteroid.size + player1.size) {
      mod.frequency.value = 20;
      osc.frequency.value = 5000;
      scoreBoard.collisions++;
      scoreBoard.curScore = 0;
    }
  });


  shurikens.forEach(function (asteroid) {
    var dx = asteroid.x - player1.x;
    var dy = asteroid.y - player1.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if(distance < asteroid.size + player1.size) {
      osc.frequency.value += 200;
      scoreBoard.collisions++;
      scoreBoard.curScore = 0;
    }
  });
  d3.select(".current span")
  .text("" + scoreBoard.curScore);
  d3.select(".collisions span")
  .text("" + scoreBoard.collisions);

}, 15);

setInterval(function () {
  osc.frequency.value = 0;
  mod.frequency.value = 0;}, 300);
