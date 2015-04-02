window.playerModel = Backbone.Model.extend({
	defaults: {
		//things that the playermodel needs
		newestBid: undefined,
		currentBid: undefined,
		tokensWon: [], //will be an array of strings, symbolizing the tokens won
		//OR, maybe I should just keep them inside the model, 
		//holding reference to the players that won them...
		username: undefined,
		//score is number of tokens
		//WHAT ELSE?
	},
	// events: {
	// 	'click' : 'captureBid',
	// 	'submit form': 'captureBid'
	// },

	initialize: function(){
		// console.log('new player created, with name : ', this.get('username'));
		this.resetBids();
		this.set('cid', this.cid);
		this.on('newBidEvent', this.handleNewBid, this);
		// this.on('newBidEvent')
	},
	// wonToken: function(tokenSym){
	// 	this.get('tokensWon').push(tokenSym);
	// },
	// getScore: function(){
	// 	return this.get('tokensWon').length;
	// },
	handleNewBid : function(bidData){
		console.log('bidData :', bidData);
		console.log(typeof bidData);
		var oldBid = this.get('currentBid');
		var newBid = bidData[0];
		debugger;
		var bidNumber = rootModel.get('scoreModel').get('bidCounter');
		if (oldBid.bidNumber === undefined){
			this.set('currentBid', {
				moves: newBid,
				bidNumber: bidNumber
			});
			console.log('no previous bid, new bid of :', newBid, "with number :", bidNumber);
		} else if (newBid < oldBid.moves) {
			console.log('previous bid: ', this.get('currentBid'));
			this.set('currentBid', {
				moves: newBid,
				bidNumber: bidNumber
			});
			console.log('newBid : ', this.get('currentBid'));
		}
		this.set('newestBid', undefined);;
		Backbone.Events.trigger('newBid');
	},
	resetBids: function(){
		this.set('currentBid', {
			moves: 'none',
			bidNumber: undefined
		});
	},
	addPoint: function(newToken){
		//testing function to push to tokensWon;
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
    // captureBid: function(e){
    // 	console.log('e :',e);
    // 	console.log(e.target.offsetParent.localName);
    // 	if (e.target === 'button.btn.bid-btn'){
    // 		console.log('button!' + this.model.get('username'))
    // 	}else {
    // 		console.log('not button')
    // 	}
    // 	console.log('submit seen')
    // }
});