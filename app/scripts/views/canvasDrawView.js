window.canvasDrawView = Backbone.View.extend({
  render: function() {
    var context = this.getContext();
    var boardProps = this.getWidthAndSize();
    var completeBoard = this.model.get('boardModel').get('completeBoard');
    console.log('completeBoard :', completeBoard);
    this.model.set('boxSize', boardProps.bsize);
    /**
     * Render the canvas first, which is a 16x16 grid of grey lines.
     * drawBoardProps on top of the canvas:
     *  walls are thicker black lines
     *  shapes inside the squares
     */
    this.canvasRender(context, boardProps.bw, boardProps.bsize);
    this.drawBoardProps(context, boardProps.bw, boardProps.bsize, completeBoard);

    // setInterval(function(){
    //   context.rotate(Math.PI);
    //   console.log('rotate');
    // },2000);
  },
  getContext: function(){
    var canvas = document.getElementById('boardCanvas');
    var context = canvas.getContext("2d");
    return context;
  },
  getWidthAndSize: function(){
      var bw = this.model.get('boardModel').get('boardWidth');
      var bh = bw;
      var boxSize = (bw-5)/16;
      console.log('boxSize : ', boxSize);
      return {
        bsize: boxSize,
        bw: bw
      };
  },
  canvasRender: function(context, boardWidth, boxSize){  
      function drawBoard(){
        var p = 2
        for (var x = 0; x < boardWidth; x += boxSize) {
            context.moveTo(x + p, p);
            context.lineTo(x + p, boardWidth + p-5);
        }
        for (var x = 0; x < boardWidth; x += boxSize) {
            context.moveTo(p, x + p);
            context.lineTo(boardWidth + p-5, x + p);
        }
        context.strokeStyle = "grey";
        context.stroke();
      }

      drawBoard();
  },
  drawBoardProps: function(context, boardWidth, boxSize, completeBoard){
      context.beginPath();
      var p = 2;
      function drawBoardProps(viewCtx){
        for (var row = 0; row < 16; row++){
          for(var col = 0; col < 16; col++){
            var x = p+(col*boxSize);
            var y = p+(row*boxSize);
            var squareProps = completeBoard[row][col];
            if (squareProps === "X"){
              //draw nothing
              continue;
            }
            viewCtx.drawWalls(context, boxSize, x, y, squareProps);
            var colorIndex = viewCtx.indexOfColorOrShape(squareProps, "RGBY");
            if (colorIndex !== -1){
              var color = squareProps[colorIndex];
              var shape = squareProps[viewCtx.indexOfColorOrShape(squareProps, "CTQH")];
              viewCtx.drawShape(context, boxSize, x, y, color, shape);
            }
          }
        }
      }

      var ctx = this
      drawBoardProps(ctx);
  },
  indexOfColorOrShape: function(propString, searchString){
    for(var i =0 ; i < searchString.length; i++){
      var index = propString.indexOf(searchString[i]);
      if (index !== -1){
        return index;
      }
    }
    return -1;
  },
  drawWalls: function(context, boxSize, x, y, propString){
    // if(propString === "E"){
    //   debugger;
    // }
    if (propString.indexOf("N") !== -1){
      this.drawOneWall(context, boxSize, x, y, "N");
    } 
    if (propString.indexOf("W") !== -1){
      this.drawOneWall(context, boxSize, x, y, "W");
    } 
    if (propString.indexOf("S") !== -1){
      this.drawOneWall(context, boxSize, x, y, "S");
    } 
    if (propString.indexOf("E") !== -1){
      this.drawOneWall(context, boxSize, x, y, "E");
    }
  },
  drawOneWall: function(context, boxSize, x, y, dir){
      context.moveTo(x,y);
      context.beginPath();
      //ld, lineDetail hash to draw lines relative to passed-in x and y
      var ld = {
        N:{
          start:{x: 0, y:0},
          end:{x: boxSize, y: 0}
        },
        S:{
          start:{x:boxSize, y:boxSize},
          end:{x:0, y:boxSize}
        },
        W:{
          start:{x: 0, y:0},
          end:{x:0, y:boxSize}
        },
        E:{
          start:{x: boxSize, y: 0},
          end:{x: boxSize, y: boxSize}
        }
      }

      context.moveTo(x+ld[dir].start.x,y+ld[dir].start.y)
      context.lineWidth = 5;

      context.lineTo(x+ld[dir].end.x,y+ld[dir].end.y);
      context.strokeStyle = "#66665D";
      context.stroke();
  },
  drawShape: function(context, boxSize, x, y, color, shape){
    var colorHex = this.model.get('colorHex');
    // console.log("drawing " + color + " " + shape + " at : x y:", x , y)
    if (shape === "Q"){
      context.fillStyle = colorHex[color];
      context.beginPath();
      context.moveTo(x+boxSize*.25, y+boxSize*.25);
      context.lineTo(x+boxSize*.75, y+boxSize*.25);
      context.lineTo(x+boxSize*.75, y+boxSize*.75);
      context.lineTo(x+boxSize*.25, y+boxSize*.75);
      context.closePath();
      context.fill();
    } else if (shape === "C"){
      context.fillStyle = colorHex[color];
      context.beginPath();
      context.arc(
        x+boxSize*.5,
        y+boxSize*.5,
        boxSize*.25,
        0, 2*Math.PI,
        false
        )
      context.fill();   
      //for borders:
      // context.lineWidth = 5;
      // context.strokeStyle = '#003300';//something else
      // context.stroke();         
    } else if (shape === "T"){
      context.fillStyle = colorHex[color];
      context.beginPath();
      context.moveTo(x+boxSize*.25, y+boxSize*.75);
      context.lineTo(x+boxSize*.75, y+boxSize*.75);
      context.lineTo(x+boxSize*.5, y+boxSize*.25);
      context.closePath();
      context.fill();
    } else if (shape === "H"){
      context.fillStyle = colorHex[color];
      context.beginPath();
      context.moveTo(x+boxSize*.2, y+boxSize*.7);
      context.lineTo(x+boxSize*.2, y+boxSize*.3);
      context.lineTo(x+boxSize*.5, y+boxSize*.15);
      context.lineTo(x+boxSize*.8, y+boxSize*.3);
      context.lineTo(x+boxSize*.8, y+boxSize*.7);
      context.lineTo(x+boxSize*.5, y+boxSize*.85);
      context.closePath();
      context.fill();
    }
  },
  drawRobots: function(){
    //try using overlaid elements
  }
});