// one object holds info on svg width, heigh ... DONE
// one object hold scoreBoard info, maxScore, curScore DONE
// create class called asteroid with properties size, widith, color ...
  // add methods
    // calculate where to move ...
    // change size every 300 ms
    // do something if collision
// create class called player with properties like size width color, bind to arrow keys
  // methods
    // check for collisions ????


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
  this.size = Math.random() * 15 + 10;
  this.x = Math.random() * (boardInfo.width-30);
  this.y = Math.random() * (boardInfo.height-30);
  this.xv = Math.random() * 3 + 3;
  this.yv = Math.random() * 3 + 3;
}

// Asteroid.prototype.move = function () {
//   this.x += Math.cos(this.angle) * 50;
//   this.y += Math.sin(this.angle) * 50;
// }

var Player = function() {
  this.size = 10;
  this.x = 400;
  this.y = 200;
}

var svg = d3.select(".board").append("svg")
  .attr("width", boardInfo.width)
  .attr("height", boardInfo.height);

var asteroids = [];

for(var i = 0; i<15; i+=1) {
  asteroids.push(new Asteroid());
}
var player1 = new Player();
var player1D3 = svg.selectAll("circle").data([player1])
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
  .duration(10);

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

}, 10);
