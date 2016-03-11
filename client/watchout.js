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
  width: 600,
  height: 400
};

var scoreBoard = {
  curScore: 0,
  maxScore: 0
}

var Asteroid = function() {
  this.size = Math.random() * 30 + 20;
  this.x = Math.random() * boardInfo.width;
  this.y = Math.random() * boardInfo.height;
}

