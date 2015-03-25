window.robotModel = Backbone.Model.extend({
	defaults: {
		color: undefined,
		row: undefined,
		col: undefined
	},
	initialize: function(){
		console.log('new '+this.get('color')+ ' robot at: R/C', 
			this.get('row'),
			this.get('col'));
	}
})