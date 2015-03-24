window.canvasDrawView = Backbone.View.extend({
  render: function() {
    var context = this.getContext();
    var width_Size = this.getWidthAndSize();
    var completeBoard = this.model.get('boardModel').get('completeBoard');

    this.canvasRender(context, width_Size.bw, width_Size.bsize);
    this.drawWalls(context, width_Size.bw, width_Size.bsize, completeBoard);
  },
  getContext: function(){
    var canvas = document.getElementById('boardCanvas');
    var context = canvas.getContext("2d");
    return context;
  },
  getWidthAndSize: function(){
      var bw = this.model.get('boardModel').get('boardWidth');
      var bh = bw;
      var boxSize = (bw-20)/16
      return {
        bsize: boxSize,
        bw: bw
      };
  },
  canvasRender: function(context, boardWidth, boxSize){  
      function drawBoard(){
        var p = 16
        for (var x = 0; x < boardWidth; x += boxSize) {
            context.moveTo(x + p, p);
            context.lineTo(x + p, boardWidth + p-20);
        }

        for (var x = 0; x < boardWidth; x += boxSize) {
            context.moveTo(p, x + p);
            context.lineTo(boardWidth + p-20, x + p);
        }
        context.strokeStyle = "grey";
        context.stroke();
      }

      drawBoard();
  },
  drawWalls: function(context, boardWidth, boxSize, completeBoard){
      console.log("complete: ",completeBoard);
      context.beginPath();
      var p = 16;

      function drawWalls(viewCtx){
        //for each row in the complete board
        /**
         * for each square on the row:
         *  determine the top right corner
         *  determine walls, and shapes that need to be drawn
         *  
         *  add the walls
         *  call a drawShape function, assing context and x/y
         * 
         */
        for (var row = 0; row < 16; row++){
          for(var col = 0; col < 16; col++){
            var x = p+(col*boxSize);
            var y = p+(row*boxSize);
            var squareProps = completeBoard[row][col];
            // if (squareProps === "SEYH") {
            //   debugger;
            // }
            // console.log('x, y, propString :', x,y,squareProps);
            if (squareProps === "X"){
              //draw nothing
              continue;
            }
            if (squareProps.indexOf("N") !== -1){
              viewCtx.drawOneWall(context, boxSize, x, y, "N");
            } 
            if (squareProps.indexOf("W") !== -1){
              viewCtx.drawOneWall(context, boxSize, x, y, "W");
            } 
            if (squareProps.indexOf("S") !== -1){
              viewCtx.drawOneWall(context, boxSize, x, y, "S");
            } 
            if (squareProps.indexOf("E") !== -1){
              viewCtx.drawOneWall(context, boxSize, x, y, "E");
            }
            var colorIndex = viewCtx.indexOfColorOrShape(squareProps, "RGBY");
            if (colorIndex !== -1){
              var color = squareProps[colorIndex];
              var shape = squareProps[viewCtx.indexOfColorOrShape(squareProps, "CTQH")];
              viewCtx.drawShape(context, x, y, color, shape);
            }

          }

        }
      }
      var ctx = this
      drawWalls(ctx);

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
  drawOneWall: function(context, boxSize, x, y, dir){
      context.moveTo(x,y);
      context.beginPath();
      console.log("drawing wall: ", dir, "at : x y :", x, y);
      //ld, lineDetail
      //draw relative to x and y
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
          start:[boxSize,0],
          end:{x: boxSize, y: boxSize}
        }
      }
      context.moveTo(x+ld[dir].start.x,y+ld[dir].start.y)
      context.lineWidth = 5;

      context.lineTo(x+ld[dir].end.x,y+ld[dir].end.y);
      context.strokeStyle = "black";
      context.stroke();
  },
  drawShape: function(context, x, y, color, shape){
    console.log("drawing" + color + " " + shape + " at : x y:", x , y)

  }
});