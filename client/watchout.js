// one object holds info on svg width, heigh ... DONE
// one object hold scoreboard info, maxScore, curScore DONE
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
  maxScore: 0
}

var Asteroid = function() {
  this.size = Math.random() * 15 + 10;
  this.x = Math.random() * boardInfo.width;
  this.y = Math.random() * boardInfo.height;
}

var Player = function() {
  this.size = 30;
  this.x = 300;
  this.y = 200;
}

var svg = d3.select(".board").append("svg")
  .attr("width", boardInfo.width)
  .attr("height", boardInfo.height);

var asteroids = [];

for(var i = 0; i<20; i+=1) {
  asteroids.push(new Asteroid());
}

svg.selectAll(".asteroid").data(asteroids)
  .enter().append("circle").attr("r", function(d) {return d.size})
  .attr("cx", function(d) {return d.x;})
  .attr("cy", function(d) { return d.y;});



