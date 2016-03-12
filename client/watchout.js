// create Shuriken class
  // looks like a star
  // spins
  // follows player

var boardInfo = {
  width: 800,
  height: 400
};

var scoreBoard = {
  curScore: 0,
  maxScore: 0,
  collisions: 0
}

var Asteroid = function() {
  this.size = Math.random() * 10 + 10;
  this.x = Math.random() * (boardInfo.width-30);
  this.y = Math.random() * (boardInfo.height-30);
  this.xv = Math.random() * 3 + 3;
  this.yv = Math.random() * 3 + 3;
}
var Player = function() {
  this.size = 10;
  this.x = 400;
  this.y = 200;
}

var Shuriken = function() {
  this.points = [[0,5], [14.142,14.142],
                [5,0], [14.142,-14.142],
                [0,-5], [-14.142,-14.142],
                [-5,0], [-14.142,14.142],
                [0,5]];
  this.outerRadius = 20;
  this.innerRadius = 10;
  this.x = Math.random() * (boardInfo.width-30);
  this.y = Math.random() * (boardInfo.height-30);
}

Shuriken.prototype.movePoints = function () {
  var points = "";
  this.points.forEach((function(point) {
    point[0] += this.x;
    point[1] += this.y;
    points += point.toString() + " ";
  }).bind(this))
  return points;
}
function createObjects(Class, num) {
  var elements = [];
  for(var i = 0; i<num; i+=1) {
    var instance = new Class();
    elements.push(instance);
  }
  return elements;
}

var asteroids = createObjects(Asteroid, 10);
var shurikens = createObjects(Shuriken, 2);
var players = createObjects(Player, 1);

var player1 = players[0];

var svg = d3.select(".board").append("svg")
  .attr("width", boardInfo.width)
  .attr("height", boardInfo.height);

var player1D3 = svg.selectAll("circle").data(players)
  .enter().append("circle").attr("r", function(d) {return d.size})
  .attr("cx", function(d) {return d.x;})
  .attr("cy", function(d) {return d.y;})
  .attr("class", "player")
  .attr("fill", "red");

svg.selectAll("circle").data(asteroids)
  .enter().append("circle").attr("r", function(d) {return d.size})
  .attr("cx", function(d) {return d.x;})
  .attr("cy", function(d) { return d.y;})
  .attr("class", "asteroid")

svg.selectAll(".shuriken")
  .data(shurikens)
  .enter()
  .append("polygon")
  .attr("points", function(d) {return d.movePoints()})
  .attr("dx", function(d) {return d.x;})
  .attr("dy", function(d) {return d.y;})
  .attr("class", "shuriken")
  .attr("fill", "green");


d3.select("svg").on("mousemove", function() {
  var coordinates = d3.mouse(this);
  player1.x = coordinates[0];
  player1.y = coordinates[1];
  player1D3.attr("cx", coordinates[0])
  .attr("cy", coordinates[1])
  .transition()
  .duration(10);
  scoreBoard.curScore++;
})

setInterval(function () {
  d3.selectAll(".asteroid")
  .attr("cx", function(d) {
    if (d.x >= (boardInfo.width - d.size) || d.x <= d.size) {
      d.xv = -1 * d.xv;
    }
    d.x += d.xv;
    return d.x;
  })
  .attr("cy", function(d) {
    if (d.y >= boardInfo.height - d.size || d.y <= d.size) {
      d.yv = -1 * d.yv;
    }
    d.y += d.yv;
    return d.y;
  })
  .transition()
  .duration(15);

  if (scoreBoard.curScore > scoreBoard.maxScore) {
    scoreBoard.maxScore = scoreBoard.curScore
  }
  d3.select(".highscore span")
  .text("" + scoreBoard.maxScore);
  asteroids.forEach(function (asteroid) {
    var dx = asteroid.x - player1.x;
    var dy = asteroid.y - player1.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if(distance < asteroid.size + player1.size) {
      scoreBoard.collisions++;
      scoreBoard.curScore = 0;
    }
  });

  d3.select(".current span")
  .text("" + scoreBoard.curScore);
  d3.select(".collisions span")
  .text("" + scoreBoard.collisions);

}, 15);
