window.canvasDrawView = Backbone.View.extend({
  render: function() {
    var context = this.getContext();
    var boardProps = this.getWidthAndSize();
    var completeBoard = this.model.get('boardModel').get('completeBoard');
    //start by filling board with background:
    //
    var canvas  = $('#boardCanvas');
    var width = canvas.attr('width');
    var height = canvas.attr('height');

    var colorHash = this.model.get('colorHex');
    context.fillStyle = colorHash['background'];
    context.rect(0,0, width, height);
    context.fill();
    // console.log('completeBoard :', completeBoard);
    this.model.set('boxSize', boardProps.bsize);
    /**
     * Render the canvas first, which is a 16x16 grid of grey lines.
     * drawBoardProps on top of the canvas:
     *  walls are thicker black lines
     *  shapes inside the squares
     */
    this.canvasRender(context, boardProps.bw, boardProps.bsize);
    this.drawBoardProps(context, boardProps.bw, boardProps.bsize, completeBoard);
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
      // console.log('boxSize : ', boxSize);
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

            /**
             * Placeholder, to draw background on squares.
             */
            
            if (squareProps === "X"){
              //draw nothing
              continue;
            }

            //Draw shapes based on the propertyString.
            viewCtx.drawWalls(context, boxSize, x, y, squareProps);
            var colorIndex = viewCtx.indexOfColorOrShape(squareProps, "RGBY");
            if (colorIndex !== -1){
              var color = squareProps[colorIndex];
              var shape = squareProps[viewCtx.indexOfColorOrShape(squareProps, "CTQH")];

              //add the tokens to scoreModel, so a game can start.
              var newToken = {
                color : color,
                shape : shape,
                loc   : {
                  row   : row,
                  col   : col
                } 
              }
              rootModel.get('scoreModel').addToken(newToken);
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
  drawBackgroundX: function(context, boxSize, x, y){
    /**
     * 8 grey dots
     * grey border square
     * darkgrey minisquare
     * yellow stripes moving diag..REALLY close to offwhite color, lil'yellow
     *
     * offwhite center sq...as huge border to block off missmatch from lines
     */
    

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
  drawShape: function(context, boxSize, x, y, color, shape, center){
    if (center){
      var x = 7*boxSize;
      var y = 7*boxSize;
      boxSize *= 2;
      var p = 0.97
      var r = [boxSize*p, boxSize*(1-p)]; 
      //clear the rect
      context.beginPath();
      context.clearRect(x+r[1], y+r[1], r[0], r[0]);
      context.fillStyle = '#51514B';
      context.fillRect(x+r[1], y+r[1], r[0], r[0]);
    } else {
      //placeholder, where all tokens were previously added
    }
    var colorHex = this.model.get('colorHex');
    if (shape === "Q"){
      context.fillStyle = colorHex[color];
      context.beginPath();
      context.moveTo(x+boxSize*.25, y+boxSize*.25);
      context.lineTo(x+boxSize*.75, y+boxSize*.25);
      context.lineTo(x+boxSize*.75, y+boxSize*.75);
      context.lineTo(x+boxSize*.25, y+boxSize*.75);
      context.closePath();
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = colorHex['silverBorder'];
      context.stroke();


      context.fillStyle = colorHex['silverBorder'];
      context.beginPath();
      context.arc(
        x+boxSize*.5,
        y+boxSize*.5,
        boxSize*.14,
        0, 2*Math.PI,
        false
        )
      context.fill();

      context.beginPath();
      for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
          xPos = x+boxSize*.51 - (boxSize*.04 * Math.sin(i)) * Math.sin(0.76 * Math.PI) + (boxSize*.31 * Math.cos(i)) * Math.cos(0.76 * Math.PI);
          yPos = y+boxSize*.51 + (boxSize*.31 * Math.cos(i)) * Math.sin(0.76 * Math.PI) + (boxSize*.04 * Math.sin(i)) * Math.cos(0.76 * Math.PI);

          if (i == 0) {
              context.moveTo(xPos, yPos);
          } else {
              context.lineTo(xPos, yPos);
          }
      }
      context.lineWidth = 2;
      context.strokeStyle = colorHex['silverBorder'];
      context.stroke();

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
      context.lineWidth = 3;
      context.strokeStyle = colorHex['silverBorder'];
      context.stroke();
      context.beginPath();
      // context.moveTo(x+boxSize*.5, y+boxSize*.5);
      var u = 15;
      var ap ={//arc points
        // x     : 2 ,
        // y     : 2,
        // r     : 1,
        a1    : 0.37*Math.PI,
        a2    : 1.25*Math.PI
      }
      // var bp ={ //bezierPoints
      //   cp1x  : 1.4,
      //   cp1y  : 1.19,
      //   cp2x  : 0.93,
      //   cp2y  : 2.24,
      //   x     : 1.69,
      //   y     : 2.95
      // }
      // context.arc(ap.x*u, ap.y*u, ap.r*u, ap.a1, ap.a2);
      // context.bezierCurveTo(bp.cp1x *u, bp.cp1y*u, bp.cp2x*u, bp.cp2y*u, bp.x*u, bp.y*u)//Fill the moon contour and projection
      // context.arc(x, y, ap.r*u, ap.a1, ap.a2);
      // context.bezierCurveTo(bp.cp1x *u, bp.cp1y*u, bp.cp2x*u, bp.cp2y*u, bp.x*u, bp.y*u)//Fill the moon contour and projection
      context.arc(x+boxSize*.5, y+boxSize*.5, boxSize*.16, ap.a1, ap.a2);
      // context.bezierCurveTo(x+bp.cp1x *u, y+bp.cp1y*u, x+bp.cp2x*u, y+bp.cp2y*u, x+bp.x*u, y+bp.y*u)//Fill the moon contour and projection
      //gave bezierCurves an honest shot.
      //
      context.lineWidth = 0.08*boxSize;
      context.strokeStyle = colorHex['silverBorder']
      context.stroke();
      context.fillStyle = colorHex['silverBorder'];
      context.fill()
    } else if (shape === "T"){
      context.fillStyle = colorHex[color];
      context.beginPath();
      context.moveTo(x+boxSize*.25, y+boxSize*.75);
      context.lineTo(x+boxSize*.75, y+boxSize*.75);
      context.lineTo(x+boxSize*.5, y+boxSize*.25);
      context.closePath();
      context.strokeStyle = colorHex['silverBorder'];
      context.lineWidth = 0.11 * boxSize;
      context.stroke();
      context.fill();

      context.strokeStyle = colorHex['silverBorder'];
      context.beginPath();
      context.arc(
        x+boxSize*.5,
        y+boxSize*.59,
        boxSize*.14,
        0, 2*Math.PI,
        false
        )
      context.lineWidth = boxSize*0.05;
      context.stroke();
    } else if (shape === "H"){
      context.fillStyle = colorHex[color];
      context.beginPath();
      context.moveTo(x+boxSize*.2, y+boxSize*.7); //bottom left
      context.lineTo(x+boxSize*.2, y+boxSize*.3); //top left
      context.lineTo(x+boxSize*.5, y+boxSize*.15); //top top
      context.lineTo(x+boxSize*.8, y+boxSize*.3); //top right
      context.lineTo(x+boxSize*.8, y+boxSize*.7); //bottom right
      context.lineTo(x+boxSize*.5, y+boxSize*.85); //bottom bottom
      context.closePath();
      context.fill();
      context.strokeStyle = colorHex['silverBorder'];
      context.lineWidth = boxSize*.06;
      context.stroke();

      var cp = {//centerpoint
        x: x+boxSize*.5,
        y: y+boxSize*.5,//x and y coords
        r1: boxSize*.06,//range 1
        r2: boxSize*.4,//range 2
      }

      context.fillStyle = colorHex['silverBorder'];
      context.strokeStyle = colorHex['silverBorder'];
      context.lineWidth = boxSize*.02;
      context.beginPath();
      context.moveTo(cp.x-cp.r1, cp.y-cp.r1); //r1 top left
      context.lineTo(cp.x, cp.y-cp.r2); // toptoptop
      context.lineTo(cp.x+cp.r1, cp.y-cp.r1); // r1 top right
      context.lineTo(cp.x+cp.r2, cp.y); // right right
      context.lineTo(cp.x+cp.r1, cp.y+cp.r1); // r1 bot right
      context.lineTo(cp.x, cp.y+cp.r2); // botbotbot
      context.lineTo(cp.x-cp.r1, cp.y+cp.r1); // r1 bot left
      context.lineTo(cp.x-cp.r2, cp.y); // left left
      context.closePath();
      context.fill()
    }
  },
  drawRobots: function(){
    //see robotView. these have been refactored out into a separate canvas for animation
  }
});