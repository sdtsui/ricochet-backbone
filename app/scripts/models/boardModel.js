window.boardModel = Backbone.Model.extend({
    defaults: {
        boardWidth: undefined,
        quadrantArrangement: undefined,
        completeBoard: undefined,
        enteringMove: true,
        baseQuadrants: new quadrantHolder({}),
        rHash : {
            //hash for a 90 degree rotation
            N: "E",
            E: "S",
            S: "W",
            W: "N"
        },
        dHash : {
            N: {
                row: -1,
                col: 0,
                opposite: 'S'
            },
            S: {
                row: 1,
                col: 0,
                opposite: 'N'
            },
            E: {
                row: 0,
                col: 1,
                opposite: 'W'
            },
            W: {
                row: 0,
                col: -1,
                opposite: 'E'
            }
        },
        robots : undefined,
        activeRobot: undefined
    },
    initialize: function(){
        this.on('all', function(n){
            console.log('Local Change : ', n);
        })
        this.set('quadrantArrangement', this.setQuads());
        this.constructBoard(this.get('quadrantArrangement'));
        this.setRobots();
        console.log('setRobots: ', this.get('robots'));
        //N,S,E,W:
        Backbone.Events.on('all', function(n){
            console.log('Global Event : ', n);
            if (n.slice(0,3) === 'key'){
                this.respondToKey(n);
            }
        }, this);
    },
    respondToKey : function(keyName){
        var activeRobot = this.get('activeRobot');
        if (activeRobot && keyName.length === 4){
            this.moveRobot(keyName[3], activeRobot);
        }
    },
    moveRobot : function(dir, robot){
        var robotToMove = this.get('robots').where({color: robot})[0];
        var loc = robotToMove.get('loc');
        console.log('robot props :', robotToMove, robotToMove.attributes);
        var completeBoard = this.get('completeBoard');
        var occupiedSquares = this.get('occupiedSquares');
        /**
         * Control flow:
         * if a move in that direction is valid:
         *  move in that direction, update position, call again
         * else 
         *  stop
         *
         * if moves === 0, do nothing, disregard click
         * else
         *  savePosition, update lastMoveDir,
         *  update loc...which should trigger a transition.
         */
        var next = {
            nextSquare: undefined,
            lastValidSquare: undefined,
            moves: 0
        }
        next.nextSquare = this.checkMoveDirValid(loc, dir, robotToMove, completeBoard, occupiedSquares)
        //if valid, nextSquare is truthy
        while (next.nextSquare !== false){
            next.moves++;
            next.lastValidSquare = next.nextSquare;
            next.nextSquare = this.checkMoveDirValid(next.nextSquare, dir, robotToMove, completeBoard, occupiedSquares);
        }
        if (next.moves === 0){
            console.log('illegal : nothing happens; should disregard keydown');
        } else {
            /**
             * Finalize move by:
             *-Update occupiedSquares to keep robotLocations consistent
             *-Save robot's current location to lastLoc, with savePosition.
             *-Save robot's last move to dir.
             * --finally, updating a location, which should trigger an animation
             */
            //get current location that is definitely in occupiedSquares
            /**
             * splice that location out of the array
             * copy/save the array, reassign to occupiedSquares
             */
            //as an array
            var lastLoc = [loc.row,loc.col];
            var lastIndex;
            _.each(occupiedSquares, function(value,key){
                if (value[0] === lastLoc[0] && value[1] === lastLoc[1]){
                    lastIndex = key;
                }
            });
            robotToMove.savePosition();
            robotToMove.set('lastMoveDir', dir);
            occupiedSquares.splice(lastIndex,1);
            occupiedSquares = occupiedSquares.slice()
            occupiedSquares.push([next.lastValidSquare.row, next.lastValidSquare.col]);
            this.set('occupiedSquares', occupiedSquares);

            robotToMove.set('loc', next.lastValidSquare);
            console.log('(DONE) robot moving : ', next.moves, ' in direction : ', dir);
        }
    },
    checkMoveDirValid : function(loc, dir, robot, completeBoard, occupiedSquares){
        var dHash = this.get('dHash');
        if (robot.get('lastMoveDir') === dHash[dir].opposite) {
            //moving back is illegal
            return false
        }
        var robotLoc = loc;
        if (completeBoard[robotLoc.row][robotLoc.col].indexOf(dir) !== -1){
            //moving into a wall on this square is illegal
            return false;
        }
        var movement = dHash[dir]
        var nextSquare = {
            row: robotLoc.row + movement.row,
            col: robotLoc.col + movement.col
        }
        if (
            _.some(occupiedSquares, function(value){
                return ((value[0] === nextSquare.row) && (value[1] === nextSquare.col))
                //SOME matches, meaning at least 1 match between new location & existing occupiedSquares
            })
            )
        {
            return false;
            //ie, next square is occupied
        }
        //no conflicts, move is legal
        return nextSquare;
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
        var occupiedSquares = [[7,7], [7,8], [8,7], [8,8]]
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
                occupiedSquares.push(newCoords.slice());
                newRobots.push(new robotModel({
                    color: robotColors.shift(),
                    loc: {
                        row: newCoords[0],
                        col: newCoords[1]
                    },
                    boxSize: this.get('boxSize'),
                    boardModel: this
                }));
            }
        }
        this.set('robots', new robots(newRobots));
        this.set('occupiedSquares', occupiedSquares);
    },
    // newGame: function(){
    // },
    // newRound: function(){
    // },
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
