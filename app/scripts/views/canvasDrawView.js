window.canvasDrawView = Backbone.View.extend({
    render: function() {
        var context = this.getContext();
        var boardProps = this.getWidthAndSize();
        var completeBoard = this.model.get('boardModel').get('completeBoard');
        //start by filling board with background:
        var canvas  = $('#boardCanvas');
        var width = canvas.attr('width');
        var height = canvas.attr('height');

        var colorHash = this.model.get('colorHex');
        context.fillStyle = colorHash['background'];
        context.rect(0,0, width, height);
        context.fill();
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
    //gets Width and Size out of the model...much of this could be refactored to follow better practices, assigning properties directly to the view, and using Backbone's event system to update.
    getWidthAndSize: function(){
          var bw = this.model.get('boardModel').get('boardWidth');
          var bh = bw;
          var boxSize = (bw-5)/16;
          return {
            bsize: boxSize,
            bw: bw
          };
    },
    canvasRender: function(context, boardWidth, boxSize){  
        function drawBoard(){
            var p = 2;
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
        function drawBackBoardProps(viewCtx){
            for (var row = 0; row < 16; row++){
                for(var col = 0; col < 16; col++){
                var x = p+(col*boxSize);
                var y = p+(row*boxSize);
                var squareProps = completeBoard[row][col];
                viewCtx.drawBackgroundX(context, boxSize, x, y);
                }
            }
        }
        var ctx = this
        drawBackBoardProps(ctx);
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
    /**
     * This function draws the background graphic on every tile of the board.
     * Note that it does this before any other drawings is done, so that the symbol stays underneath token symbols and robots.
     */
    drawBackgroundX: function(context, boxSize, x, y){
        var colorHex = this.model.get('colorHex');
        /**
         * 8 grey dots
         * grey border square
         * darkgrey minisquare
         * yellow stripes moving diag..REALLY close to offwhite color, lil'yellow
         *
         * offwhite center sq...as huge border to block off missmatch from lines
         */
        context.beginPath();
        context.moveTo(x+boxSize*.2, y+boxSize*.2);
        context.lineTo(x+boxSize*.2, y+boxSize*.8);
        context.lineTo(x+boxSize*.8, y+boxSize*.8);
        context.lineTo(x+boxSize*.8, y+boxSize*.2);
        context.closePath();
        context.lineWidth = .25;
        context.strokeStyle = '#ABADA0';
        context.stroke();
        //moveTo
        //draw a tiny circle at 8 points
        context.lineWidth = .5;
        context.strokeStyle = '#ABADA0';

        context.beginPath();
        context.arc(x+boxSize*.16, y+boxSize*.16, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();

        context.beginPath();
        context.arc(x+boxSize*.16, y+boxSize*.84, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();

        context.beginPath();
        context.arc(x+boxSize*.84, y+boxSize*.84, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();

        context.beginPath();
        context.arc(x+boxSize*.84, y+boxSize*.16, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();

        context.beginPath();
        context.arc(x+boxSize*.16, y+boxSize*.50, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();

        context.beginPath();
        context.arc(x+boxSize*.50, y+boxSize*.16, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();

        context.beginPath();
        context.arc(x+boxSize*.50, y+boxSize*.84, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();

        context.beginPath();
        context.arc(x+boxSize*.84, y+boxSize*.50, boxSize*.015, 0, 2*Math.PI,false)
        context.stroke();
        //dark grey border
        //4 thick  diagonal dark grey strokes
        //thick yellow-orange stroke:
        context.beginPath();
        context.strokeStyle = colorHex['xSquareY'];
        context.lineWidth = boxSize*.23;
        context.moveTo(x+boxSize*.33, y+boxSize*.33);
        context.lineTo(x+boxSize*.75, y+boxSize*.75);
        context.stroke();

        //thick diag dark grey strokes
        context.beginPath();
        context.strokeStyle = colorHex['xSquareG'];
        context.lineWidth = boxSize*.09;
        context.moveTo(x+boxSize*.33, y+boxSize*.33);
        context.lineTo(x+boxSize*.75, y+boxSize*.75);
        context.stroke();

        context.beginPath();
        context.strokeStyle = colorHex['xSquareG'];
        context.lineWidth = boxSize*.08;

        context.moveTo(x+boxSize*.25, y+boxSize*.47);
        context.lineTo(x+boxSize*.50, y+boxSize*.73);
        context.stroke();

        context.moveTo(x+boxSize*(1-.25), y+boxSize*(1-.47));
        context.lineTo(x+boxSize*(1-.50), y+boxSize*(1-.73));
        context.stroke();

        context.beginPath();
        context.strokeStyle = colorHex['xSquareOverlay']
        context.lineWidth = boxSize*.13;
        context.moveTo(x+boxSize*.28, y+boxSize*.28);
        context.lineTo(x+boxSize*.28, y+boxSize*.72);
        context.lineTo(x+boxSize*.72, y+boxSize*.72);
        context.lineTo(x+boxSize*.72, y+boxSize*.28);
        context.closePath();
        context.stroke();
    },
    drawWalls: function(context, boxSize, x, y, propString){
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
    /**
     * [drawOneWall description]
     * @param  {[]} context [canvas context]
     * @param  {[]} boxSize [size in pixels of the box]
     * @param  {[]} x       [x coordinate on the board]
     * @param  {[]} y       [y coordinate on the board]
     * @param  {[]} dir     [cardinal direction the wall will be drawn on]
     * @return {[]}         [none]
     */
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
        };
        context.moveTo(x+ld[dir].start.x,y+ld[dir].start.y)
        context.lineWidth = 5;

        context.lineTo(x+ld[dir].end.x,y+ld[dir].end.y);
        context.strokeStyle = "#66665D";
        context.stroke();
    },
    //There are two default runtimes/tasks for this function.
    //One involves drawing a specified shape, at the given location in the board. This draws token targets.
    //The second task, when center is true, modifies the inputs so that a scaled, larger image is drawn in the center.
    drawShape: function(context, boxSize, x, y, color, shape, center){
    if (center){
        var x = 7*boxSize;
        var y = 7*boxSize;
        boxSize *= 2;
        var p = 0.97
        var r = [boxSize*p, boxSize*(1-p)]; 
        //clear the area where the new shape should go.
        context.beginPath();
        context.clearRect(x+r[1], y+r[1], r[0], r[0]);
        context.fillStyle = '#51514B';
        context.fillRect(x+r[1], y+r[1], r[0], r[0]);
    }
    var colorHex = this.model.get('colorHex');

    //Draw a square of the right color.
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
            );
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
        //Draw a circle of the right color.
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
            var u = 15;
            var ap ={//arc points
                a1    : 0.37*Math.PI,
                a2    : 1.25*Math.PI
            }
            //See previous commits.
            //gave bezierCurves an honest shot; would prefer to draw a crescent. Going for half-circles instead.
            context.arc(x+boxSize*.5, y+boxSize*.5, boxSize*.16, ap.a1, ap.a2);
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
            //Draw hexagonal shape of the right color.
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
    }
});