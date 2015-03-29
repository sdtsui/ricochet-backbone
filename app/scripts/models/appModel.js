window.appModel = Backbone.Model.extend({

    defaults: {
        numPlayers: undefined,
        playerCollection: undefined,
        gameRunning: false,
        roundRunning: false,
        winnerDeclared: false,
        bidManager: undefined,
        tokens: undefined,
        boardModel: undefined,
        scoreModel: undefined, //handles scores, bids, remaining tokens
        robots: undefined,
        players: undefined,
        newPlayerNames: undefined,
        colorHex: {
            brown: '#6C4E2F',
            R:'#F21018',
            G: '#39CC36',
            B: '#0C11CA',
            Y: '#EFEB1D',
            silverBorder: '#ABADA0',
            lightYellow: '#E8E549', //background
            lightGrey:  '#66665D', //center walls
            darkGrey: '#51514B' //center square
        },
        boxSize: undefined
    },
    initialize: function(){
        var windowWidth     = $(window).width()
        var windowHeight    = $(window).height() 
        var boardWidth = 
        (windowWidth <= windowHeight) ? windowWidth : windowHeight;
        boardWidth *= 0.95; 
        this.set({
            windowWidth     : windowWidth,
            windowHeight    : windowHeight,
            boardModel      : new boardModel({
                boardWidth: boardWidth
            }),
            scoreModel      : new scoreModel()
        });
        this.on('change:boxSize', function(){
            var boxSize = this.get('boxSize');
            var robots = this.get('boardModel').get('robots');
            _.each(robots.models, function(value, key, list){
                value.set('boxSize', boxSize);
            }, this)
        }, this);

        this.on('change:numPlayers', function(){
            var numPlayers = this.get('numPlayers')
            //define a set of hardcoded new players: allow for name input later..
            var newPlayers = [];
            if (numPlayers > 0){
                var newPlayerNames = this.get('newPlayerNames');
                for (var i = 0 ; i < numPlayers; i++){
                    // console.log('creating a new player:');
                    newPlayers.push(new playerModel({
                        username: newPlayerNames[i]
                    }));
                }
                var finalPlayers = new players(newPlayers);
                this.set('players', finalPlayers);
            }
        })
    },
    placeRobots: function(){
    }
});