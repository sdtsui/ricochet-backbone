// var QUAD_1A = [
//     'NW,N,N,N,NE,NW,N,N',
//     'W,S,X,X,X,X,SEYH,W',
//     'WE,NWGT,X,X,X,X,N,X',
//     'W,X,X,X,X,X,X,X',
//     'W,X,X,X,X,X,S,X',
//     'SW,X,X,X,X,X,NEBQ,W',
//     'NW,X,E,SWRC,X,X,X,S',
//     'W,X,X,N,X,X,E,NW'
// ];

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
        }
    },
    rowStringsToArrays : function(quad, size){
        var convertedQuad = [];
        for (var i = 0 ;  i < size; i++){
            convertedQuad.push(quad[i].split(','))
        }
        return convertedQuad;
    },
    adjustWallsAfterRotation : function(quad, size){
        //for each row.
        //  examine each element...
        //      replace each character in element, with rotated version
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
            // console.log("row :", i, "  :"+newRow);
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
            //testing: with a single quadrant
            // var newQuadrant = this.get('baseQuadrants').get('Q'+1)[0];
            newQuadrant = this.rowStringsToArrays(newQuadrant, 8);
            for (var j = i; j >0; j--){
                newQuadrant = this.rotateQuadrant(newQuadrant,8)
                console.log("ROTATING");
            }
            console.log("Quadrant : "+ i+ "  :" ,newQuadrant);
            quads.push(newQuadrant);
        }
        console.log('quads : ', quads);
        return quads;
    },
    // newGame: function(){
    // },
    // newRound: function(){
    // },
    initialize: function(){
        this.set('quadrantArrangement', this.setQuads());
        // console.log('QA', this.get('quadrantArrangement'));
        this.constructBoard(this.get('quadrantArrangement'));
        // console.log("cmpltBrd: ",this.get('completeBoard'));
        // console.log("cmpltBrd: ",this.get('completeBoard').length);
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