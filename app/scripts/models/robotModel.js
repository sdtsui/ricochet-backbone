window.robotModel = Backbone.Model.extend({
	defaults: {
		color: undefined,
		row: undefined,
		col: undefined,
		oldRow: undefined,
		oldCol: undefined
	},
	initialize: function(){
		Backbone.Events.on('boardAssetsRendered', this.triggerMove, this)
	},
	triggerMove: function(){
		this.trigger('updateRobotPosition');
	}
})