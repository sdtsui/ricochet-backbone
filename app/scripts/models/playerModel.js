window.playerModel = Backbone.Model.extend({
	defaults: {
		//things that the playermodel needs
		currentBid: undefined,
		tokensWon: [], //will be an array of strings, symbolizing the tokens won
		//OR, maybe I should just keep them inside the model, 
		//holding reference to the players that won them...
		username: undefined,
		//score is number of tokens
		//WHAT ELSE?
	},
	initialize: function(){
		console.log('new player created, with name : ', this.get('username'));
	},
	wonToken: function(tokenSym){
		this.get('tokensWon').push(tokenSym);
	},
	getScore: function(){
		return this.get('tokensWon').length;
	}
});