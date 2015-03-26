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
		boardModel: undefined,
		boxSize: undefined
	},
	initialize: function(){
		Backbone.Events.on('boardAssetsRendered', this.triggerMove, this)
		this.on('active', function(){
			console.log('seen active');
		})
	},
	triggerMove: function(){
		this.trigger('updateRobotPosition');
	},
	savePosition: function(){
		var lastLoc = this.get('loc');
		this.set('lastLoc') = lastLoc;
	}
})