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
					console.log('timeUp!');
					this.trigger('timeUp');
					clearInterval(checkInterval);
					this.set('timerValue', 0);
				}
			}.bind(this), 1000);
		}
	},
	initialize: function(){
		Backbone.Events.on('robotMoved', function(){
			console.log('nawp.');
			this.set('activeMoves', this.get('activeMoves')+1);
			console.log('Moves so Far :', this.get('activeMoves'));
		}, this)
		Backbone.Events.on('robotArrived', function(){console.log('YUP.');}, this)

		this.on('change:timerValue', this.checkTimer, this);
		Backbone.Events.on('skipTimer', this.skipTimer, this);

		this.on('endRound', this.newRound, this);
		Backbone.Events.on('newGame', this.newRound, this);

		this.on('timeUp', this.timeUp, this);
		Backbone.Events.on('newBid', this.handleIncomingBid, this);

		this.on('change:target', this.drawCenter, this);

		this.timerReset(this)
	},
	addToken: function(newToken){
		var tokens = this.get('tokensRemaining')
		tokens.push(newToken);
		if(this.get('tokensRemaining').length === 16){
			this.shuffleTokens()
			console.log(tokens);
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
		console.log('start a new round! GOGOGO');
			this.set('bidQueue', []);
			this.set('activePlayer', undefined);
			//remove token from tokenPool, trigger a new token so canvasDrawView 
			var remTokens = this.get('tokensRemaining')
			if (remTokens.length === 0){
				console.log('declare winner');
			} else {
				this.set('target', this.get('tokensRemaining').shift());
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
		console.log('timeUp called!');
		//collate bids.
		//requestMove....
		this.collateBids();
		this.requestMove();
	},
	activeSuccess: function(player){
		//assign point to active player
		//trigger endRound
	},
	activeFail: function(player){
		//decrement active players' points to min 0
		//add a token from the active player, back into the tokenPool
		//
		//dequeue
		//if more bids, updateActive, keep playing
		//if no more bids, re-insert the current token, shuffle the tokens
	},
	updateActive: function(){
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
		//responding to a new bid trigger event;
		var x = $('.bidfield > input');
		console.log(x);
		if (!this.get('activePlayer')){
			this.startTimer();
		}
	}
	// nextRound: function(){
	// };
});