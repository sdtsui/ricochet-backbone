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
            //right now, do nothing. 
            //maybe some responsive blinking??
        })
        this.set('quadrantArrangement', this.setQuads());
        this.constructBoard(this.get('quadrantArrangement'));
        this.setRobots();
        //N,S,E,W:
        Backbone.Events.on('all', function(n){
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
        var completeBoard = this.get('completeBoard');
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
        next.nextSquare = this.checkMoveDirValid(loc, dir, robotToMove, completeBoard);
        //if valid, nextSquare is truthy
        while (next.nextSquare !== false){
            next.moves++;
            next.lastValidSquare = next.nextSquare;
            next.nextSquare = this.checkMoveDirValid(next.nextSquare, dir, robotToMove, completeBoard);
        }
        if (next.moves === 0){
            //'illegal : nothing happens; should disregard keydown';
        } else {

            robotToMove.savePosition();
            robotToMove.set('lastMoveDir', dir);
            robotToMove.set('loc', next.lastValidSquare);

            // Checking for arrival, code pasted:
            var activeRobot = this.get('robots').where({color: robot})[0];
            var target = rootModel.get('scoreModel').get('targetToken');
            if((activeRobot.get('loc').row === target.loc.row  && activeRobot.get('loc').col === target.loc.col)//match position
                &&
                (activeRobot.get('color') === target.color) // match type
                ){
                Backbone.Events.trigger('robotArrived');
            }else {
                Backbone.Events.trigger('robotMoved');
            }
        }
    },
    checkMoveDirValid : function(loc, dir, robot, completeBoard){
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
        if (this.get('robots').squareHasConflict(nextSquare)){
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
            quads.push(newQuadrant);
        }
        return quads;
    },
    setRobots: function(){
        var newRobots = [];
        var robotColors = ['R', 'Y', 'G', 'B'];
        //row, col
        //note: occupiedSquares is now only a helper variable. 
        //no other instances should be in the app
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
                //conflict, try to find a new square
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
