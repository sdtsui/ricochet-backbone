window.appModel = Backbone.Model.extend({
    defaults: {
        boardWidth          : undefined, //set upon instantiation
        numPlayers          : undefined,
        playerCollection    : undefined,
        gameRunning         : false,
        roundRunning        : false,
        winnerDeclared      : false,
        bidManager          : undefined,
        tokens              : undefined,
        boardModel          : undefined,
        scoreModel          : undefined, //handles scores, bids, remaining tokens
        robots              : undefined,
        players             : undefined,
        newPlayerNames      : undefined,
        colorHex: {
            brown: '#6C4E2F',
            R:'#F21018',
            G: '#39CC36',
            B: '#0C11CA',
            Y: '#EFEB1D',
            silverBorder    : '#72736D',
            silverLight     : '#ABADA0', //tiny xSquare dots
            lightYellow     : '#E8E549', //background
            lightGrey       : '#66665D', //center walls
            darkGrey        : '#51514B', //center square
            background      : '#E7D4B0', //grey, orange tint
            xSquareBorder   : '#ABADA0', //tiny xSquare dots
            xSquareBg       : '#D4D7C7',//offwhite
            xSquareOverlay  : '#ECEDE6', //light, offwhite
            xSquareG        : '#DBDBDB',
            xSquareY        : '#EBE0A6'
        },
        boxSize             : undefined
    },
    initialize: function(){
        this.set({
            boardModel      : new boardModel({
                boardWidth: this.get('boardWidth')
            }),
            scoreModel      : new scoreModel()
        });
        //Helper functions that provide data that child views' render functions will need.
        //boxSize Data
        this.on('change:boxSize', function(){
            var boxSize = this.get('boxSize');
            var robots = this.get('boardModel').get('robots');
            _.each(robots.models, function(value, key, list){
                value.set('boxSize', boxSize);
            }, this)
        }, this);

        //Username data
        this.on('change:numPlayers', function(){
            var numPlayers = this.get('numPlayers')
            //define a set of hardcoded new players: allow for name input later..
            var newPlayers = [];
            if (numPlayers > 0){
                var newPlayerNames = this.get('newPlayerNames');
                for (var i = 0 ; i < numPlayers; i++){
                    newPlayers.push(new playerModel({
                        username: newPlayerNames[i]
                    }));
                }
                var finalPlayers = new players(newPlayers);
                this.set('players', finalPlayers);
            }
        });
    }
});
