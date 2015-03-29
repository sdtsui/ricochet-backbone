window.scoreModel = Backbone.Model.extend({
	defaults : {
		tokensRemaining: [],
		targetToken: undefined,
		timerValue : 60,
		timeRemaining: true,
		bidQueue : [],
		activePlayer : undefined,
		activeMoves : 0,
		interval: undefined,
		startTimerFn: function(){
			if(this.get('timerValue') === 60){
				this.set('interval', setInterval(function(){
					this.set('timerValue',
						this.get('timerValue')-1);
				}.bind(this)
					,1000)
				);			
			}

			var checkInterval = setInterval(function(){
				if (this.get('timerValue') <= 0){
					clearInterval(this.get('interval'));
					this.trigger('timeUp');
					clearInterval(checkInterval);
					this.set('timerValue', 0);
				}
			}.bind(this), 1000);
		}
	},
	initialize: function(){
		Backbone.Events.on('robotMoved', this.robotMoved, this)
		Backbone.Events.on('robotArrived', this.robotArrived, this)

		this.on('change:timerValue', this.checkTimer, this);
		Backbone.Events.on('skipTimer', this.skipTimer, this);

		this.on('endRound', this.newRound, this);
		Backbone.Events.on('newGame', this.newRound, this);

		this.on('timeUp', this.timeUp, this);
		Backbone.Events.on('newBid', this.handleIncomingBid, this);

		this.on('change:target', this.drawCenter, this);

		this.timerReset(this)
	},
	robotMoved: function(){
		//increment active moves.
		//if active moves over latest bid, trigger fail event
		console.log('nawp.');
		this.set('activeMoves', this.get('activeMoves')+1);
		console.log('Moves so Far :', this.get('activeMoves'));
	},
	robotArrived: function(){
		//if active moves under or equal to latest bid, trigger success event
		console.log('YUP.');
	},
	addToken: function(newToken){
		var tokens = this.get('tokensRemaining')
		tokens.push(newToken);
		if(this.get('tokensRemaining').length === 16){
			this.shuffleTokens()
		}
	},
	drawCenter: function(){
		var target = this.get('target');
		var grid = {
			context	: boardDetails.getContext(),
			box 	: boardDetails.getWidthAndSize(),
			grid	: boardDetails
		};
		grid.grid.drawShape(
			grid.context, 
			grid.box.bsize, 
			undefined, 
			undefined,
			target.color,
			target.shape,
			true);
	},
	shuffleTokens: function(){
		this.get('tokensRemaining').sort(function(){return Math.random()-0.5;});
	},
	newRound: function(){
		console.log('Starting a new round.');
			this.set('bidQueue', []);
			this.set('activePlayer', undefined);
			this.set('activeMoves', 0); //this could be more modular, resetting functions
			//can be separate from the new token assignment functions


			//remove token from tokenPool, trigger a new token so canvasDrawView 
			var remTokens = this.get('tokensRemaining')
			if (remTokens.length === 0){
				console.log('declare winner');
			} else {
				this.set('target', remTokens.shift());
				this.timerReset(this);
			}
	},
	timerReset : function(ctx){
		ctx.set('timerValue', 60);
		ctx.startTimer = _.once(this.get('startTimerFn').bind(this));
		ctx.set('timeRemaining', false);

	},
	skipTimer: function(){
		this.set('timerValue', 0);
	},
	checkTimer: function(){
		if (this.get('timerValue') === 0){
			if(this.get('timeRemaining')){
				this.trigger('timeUp');
				this.set('timeRemaining', false);
			}
		}
	},
	requestMove: function(){
		var activeBid = this.get('bidQueue').shift();
		this.set('activePlayer', activeBid.username);
		vex.dialog.open({
			message: 'Your move, ' + activeBid.username + '.  Your bid is '+ activeBid.value + ' moves.'
		});
		//render the board so that a player knows when they're active
		//assign a listener...for winning. remove that listener when needed.
	},
	timeUp: function(){
		//collate bids.
		//requestMove....
		this.collateBids();
		this.requestMove();
	},
	activeSuccess: function(player){
		//assign token object to active player
		//trigger endRound
	},
	activeFail: function(player){
		//decrement active players' points to min 0
		//if length >0
		//randomly select a token from active player's array of won tokens, 
		//	return them to remainingTokens
		//
		//dequeue bid, or make sure it's discarded
		//if more bids, updateActive, keep playing
		//if no more bids, re-insert the current token to remaining tokens
		//
		//shuffle the tokens
		//
		//trigger endRound
	},
	updateActive: function(){
		//(Currently not used, might be a good idea for a refactor)
		//takes the first element of the queue, assigns the owner of that bid to 'active player'
	},
	collateBids: function(){
		//uses createNewBid to take all the bid numbers, and order the players into the queue
		//use rootModel.collection...get all the bids
		var players = rootModel.get('players');
		var bids = [];
		players.each(function(player, idx){
			if(player.get('currentBid') !== 'none'){
				var newBid = this.createNewBid(player);
				bids.push(newBid);				
			}
		}.bind(this));
		bids.sort(function(bid1, bid2){
			return bid1.value - bid2.value;
		})
		this.set('bidQueue', bids);
	},
	createNewBid: function(player){
		//creates a new bid object with the bid, and a reference to the player that made it
		return {
			username 	: player.get('username'),
			value 		: player.get('currentBid'),
			playerModel : player
		};
	},
	dequeueBid: function(){
		//pop off a bid from the queue, return object
	},
	clearQueue: function(){
		this.set('bidQueue', []);
	},
	handleIncomingBid: function(){
		//This WHOLE FUNCTION MAY NOT BE NECESSARY; it only starts the timer **
		//responding to a new bid trigger event;
		var x = $('.bidfield > input');
		if (!this.get('activePlayer')){
			this.startTimer();
		}
	}
	// nextRound: function(){
	// };
});