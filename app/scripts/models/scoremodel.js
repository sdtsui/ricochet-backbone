window.scoreModel = Backbone.Model.extend({
	defaults : {
		timerValue : 60,
		bidQueue : [],
		activePlayer : undefined,
		interval: undefined
	},
	initialize: function(){
		this.on('timeChange', function(){
			//if time === 0 {
			//	trigger 'endround', collate the bids and assign an activePlayer
			//}
			//else 
			//	continue decrementing
			//rerender
		})
		this.on('endRound', function(){
			//clear all bids (clearqueue)
			//reset active player
			//
			//remove token from tokenPool
			//assign a new token
		}, this);

		this.on('newBid', function(){
			//catch the bid, run the timer if runState is still false
		});
		console.log('new Score Model!');
		// this.startTimer();
	},
	newRound: function(){
		//pop off first element of list of tokens, assign target
	},
	startTimer: function(){
		this.set('interval', setInterval(function(){
			this.set('timerValue',
				this.get('timerValue')-1);
		}.bind(this)
			,1000)
		);
	},
	skipTimer: function(){
		//bring the timer to 0
	},
	checkTimer: function(){
		//if timer === 0: trigger timeout, which should requestMove.
	},
	requestMove: function(){
		//render the board so that a player knows when they're active
		//assign a listener...for winning. remove that listener when needed.
	},
	activeSuccess: function(){
		//assign point to active player
		//trigger endRound
	},
	activeFail: function(){
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
	},
	createNewBid: function(){
		//creates a new bid object with the bid, and a reference to the player that made it
	},
	dequeueBid: function(){
		//pop off a bid from the queue, return object
	},
	clearQueue: function(){
		this.set('bidQueue', []);
	},
	handleIncomingBid: function(){
		//responding to a new bid trigger event;
		if (!this.get('activePlayer')){
			//trigger startRound
		}
	}
});