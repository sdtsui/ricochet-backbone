window.playerModel = Backbone.Model.extend({
	defaults: {
		newestBid: undefined,
		currentBid: undefined,
		tokensWon: [], //will be an array of strings, symbolizing the tokens won
		username: undefined,
	},
	initialize: function(){
		this.resetBids();
		this.set('cid', this.cid);
		this.on('newBidEvent', this.handleNewBid, this);
	},
	handleNewBid : function(bidData){
		var oldBid = this.get('currentBid');
		var newBid = bidData[0];
		var bidNumber = rootModel.get('scoreModel').get('bidCounter');
		if (oldBid.bidNumber === undefined){
			this.set('currentBid', {
				moves: newBid,
				bidNumber: bidNumber
			});
		} else if (newBid < oldBid.moves) {
			this.set('currentBid', {
				moves: newBid,
				bidNumber: bidNumber
			});
		}
		this.set('newestBid', undefined);;
		Backbone.Events.trigger('newBid');
	},
	resetBids: function(){
		this.set('currentBid', {
			moves: '-',
			bidNumber: undefined
		});
	},
	addPoint: function(newToken){
		var oldTokens = _.clone(this.get('tokensWon'));
		oldTokens.push(newToken)
		this.set('tokensWon', oldTokens);
	},
	removePoint: function(){
		var tokens = _.clone(this.get('tokensWon'));
		tokens.sort(function(){return Math.random()-0.5;});
		lostToken = tokens.shift();

		this.set('tokensWon', tokens);
		return lostToken;
	}
});
