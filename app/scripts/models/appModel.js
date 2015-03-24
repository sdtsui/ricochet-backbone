window.appModel = Backbone.Model.extend({

  defaults: {
  	gameRunning: false,
  	roundRunning: false,
  	winnerDeclared: false,
  	bidManager: undefined,
  	tokens: undefined,
  	boardModel: undefined,
  	robots: undefined,
  	players: undefined
  },
  initialize: function(){
  	var windowWidth 	= $(window).width()
  	var windowHeight 	= $(window).height() 
  	var boardWidth = (windowWidth <= windowHeight) ? windowWidth : windowHeight;
  	boardWidth *= 0.95; 
  	this.set({
  		windowWidth		: windowWidth,
  		windowHeight	: windowHeight,
  		boardModel		: new boardModel({boardWidth: boardWidth})
  	});
  }

});