window.boardModel = Backbone.Model.extend({
    defaults: {
        boardWidth: undefined,
        quadrantArrangement: undefined,
        completeBoard: undefined,
        baseQuadrants: new quadrantHolder({}),
        rHash : {
            //hash for a 90 degree rotation
            N: "E",
            E: "S",
            S: "W",
            W: "N"
        },
        robots : undefined
    },
    rowStringsToArrays : function(quad, size){
        var convertedQuad = [];
        for (var i = 0 ;  i < size; i++){
            convertedQuad.push(quad[i].split(','))
        }
        return convertedQuad;
    },
    adjustWallsAfterRotation : function(quad, size){
        var adjustedQuad = []
        for (var i = 0; i < size; i++){
            var newRow = [];
            for(var j =0 ; j < size; j++){
                var oldString = quad[i][j];
                var newString = "";
                for (var k = 0 ; k < oldString.length; k++){
                    var oldChar = oldString.charAt(k);
                    if(this.get('rHash').hasOwnProperty(oldChar)){
                        newString += this.get('rHash')[oldChar];
                    } else {
                        newString += oldChar;
                    }
                }
                newRow.push(newString);
            }
            adjustedQuad.push(newRow);
        }
        return adjustedQuad;
    },
    rotateQuadrant :  function(quad, size){
        var newQuad = [];
        for (var i = 0 ; i < size; i++){
            var newRow = [];
            for (var j = size-1; j >=0 ; j--){
                newRow.push(quad[j][i]);
            }
            newQuad.push(newRow);
        }
        return this.adjustWallsAfterRotation(newQuad, 8);
    },
    setQuads: function(){
        var quadrants = [1,2,3,4]
        var arrangement = [];
        while (quadrants.length !== 0){
            var nextQuad = _.random(0,quadrants.length-1);
            arrangement.push(quadrants.splice(nextQuad, 1)[0]);
        }
        quads = [];
        for (var i = 0; i < 4; i++){
            var side = _.random(0,1);
            var newQuadrant = this.get('baseQuadrants').get('Q'+arrangement[i])[side];
            newQuadrant = this.rowStringsToArrays(newQuadrant, 8);
            for (var j = i; j >0; j--){
                newQuadrant = this.rotateQuadrant(newQuadrant,8)
            }
            // console.log("Quadrant : "+ i+ "  :" ,newQuadrant);
            quads.push(newQuadrant);
        }
        // console.log('quads : ', quads);
        return quads;
    },
    setRobots: function(){
        var newRobots = [];
        var robotColors = ['R', 'Y', 'G', 'B'];
        //row, col
        var occupiedSquares = [[8,8], [8,9], [9,8], [9,9]]
        while(newRobots.length <4){
            var newCoords = [_.random(0,15), _.random(0,15)];
            var row = newCoords[0];
            var col = newCoords[1];
            var match = false;
            for(var i = 0; i < occupiedSquares.length; i++){
                if (
                    (occupiedSquares[i][0] === row && occupiedSquares[i][1] === col)
                    ||
                    (this.get('completeBoard')[row][col].length > 2 )
                    )
                {
                    match = true;
                    break;
                }
            }
            if (match){
                console.log('conflict at  ' + row +"|"+col+ ' trying again');
                continue;
            } else {
                occupiedSquares.push(newCoords.splice());
                newRobots.push(new robotModel({
                    color: robotColors.shift(),
                    row: newCoords[0],
                    col: newCoords[1]
                }));
            }

        }
        this.set('robots', new robots(newRobots));
    },
    // newGame: function(){
    // },
    // newRound: function(){
    // },
    initialize: function(){
        this.set('quadrantArrangement', this.setQuads());
        this.constructBoard(this.get('quadrantArrangement'));
        this.setRobots();
        console.log('setRobots: ', this.get('robots'));
    },
    constructBoard: function(boardArray){
        var newBoard = [];
        for (var i = 0; i < 8; i++){
            boardArray[0][i] += ','
            newBoard[i] = 
            boardArray[0][i].concat(boardArray[1][i]).split(",");

            boardArray[3][i] += ','
            newBoard[i+8] =
            boardArray[3][i].concat(boardArray[2][i]).split(",");
        }
        this.set('completeBoard', newBoard);
    }
});
