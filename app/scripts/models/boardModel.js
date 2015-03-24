var QUAD_1A = [
    'NW,N,N,N,NE,NW,N,N',
    'W,S,X,X,X,X,SEYH,W',
    'WE,NWGT,X,X,X,X,N,X',
    'W,X,X,X,X,X,X,X',
    'W,X,X,X,X,X,S,X',
    'SW,X,X,X,X,X,NEBQ,W',
    'NW,X,E,SWRC,X,X,X,S',
    'W,X,X,N,X,X,E,NW'
];

window.boardModel = Backbone.Model.extend({
    defaults: {
        boardWidth: undefined,
        quadrantArrangement: [undefined, undefined, undefined, undefined],
        completeBoard: undefined
    },
    // newGame: function(){
    // },
    // newRound: function(){
    // },
    initialize: function(){
        this.set('quadrantArrangement', [QUAD_1A.slice(), QUAD_1A.slice(), QUAD_1A.slice(), QUAD_1A.slice()]);
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

            boardArray[2][i] += ','
            newBoard[i+8] =
            boardArray[2][i].concat(boardArray[3][i]).split(",");
        }
        this.set('completeBoard', newBoard);
    }
});