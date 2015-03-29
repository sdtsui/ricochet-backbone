window.playerModel = Backbone.Model.extend({
	defaults: {
		//things that the playermodel needs
		newestBid: undefined,
		currentBid: 'none',
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
		this.set('cid', this.cid);
		this.on('change:newestBid', this.handleNewBid, this);
	},
	wonToken: function(tokenSym){
		this.get('tokensWon').push(tokenSym);
	},
	getScore: function(){
		return this.get('tokensWon').length;
	},
	handleNewBid : function(){
		var oldBid = this.get('currentBid');
		var newBid = this.get('newestBid');
		if (oldBid === 'none'){
			this.set('currentBid', this.get('newestBid'));
		} else if (newBid < oldBid) {
			this.set('currentBid', newBid);
		}
		this.set('newestBid', undefined);;
		Backbone.Events.trigger('newBid');
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