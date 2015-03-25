window.appModel = Backbone.Model.extend({

    defaults: {
        gameRunning: false,
        roundRunning: false,
        winnerDeclared: false,
        bidManager: undefined,
        tokens: undefined,
        boardModel: undefined,
        robots: undefined,
        players: undefined,
        colorHex: {
            brown: '#6C4E2F',
            R:'#F21018',
            G: '#39CC36',
            B: '#0C11CA',
            Y: '#EFEB1D',
            silverBorder: '#ABADA0',
            lightYellow: '#E8E549',//background
            lightGrey:  '#66665D',//center walls
            darkGrey: '#51514B'//center square
        }
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
            boardModel      : new boardModel({boardWidth: boardWidth})
        });        
    },
    placeRobots: function(){

    }

});