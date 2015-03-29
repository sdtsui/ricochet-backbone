window.robotModel = Backbone.Model.extend({
	defaults: {
		color: undefined,
		loc: {
			row: undefined,
			col: undefined
		},
		lastLoc: {
			row: undefined,
			col: undefined
		},
		roundLoc: {
			row: undefined,
			col: undefined
		},
		boardModel: undefined,
		boxSize: undefined,
		lastMoveDir: undefined //still not perfect: 
		//robot can move backwards without another robot's move clearing
		//technically illegal; a quick fix by adding a reassignment to 
		//lastMoveDir into the current robot after it clears everything
	},
	initialize: function(){
		Backbone.Events.on('boardAssetsRendered', this.triggerMove, this);
		this.on('change:loc', function(){
			// console.log('robot location changing');
			Backbone.Events.trigger('robotLocChange');
		});
	},
	setPosition: function(square){
		//used to set a valid square
		this.set('loc', square);
	},
	savePosition: function(){
		var lastLoc = this.get('loc');
		this.set('lastLoc', lastLoc);
	},
	saveStartingPosition: function(){
		var lastLoc = _.clone(this.get('loc'));
		this.set('roundLoc', lastLoc);
	},
	resetPosition: function(){
		var lastLoc = _.clone(this.get('roundLoc'));
		this.set('loc', lastLoc);		
	}
})