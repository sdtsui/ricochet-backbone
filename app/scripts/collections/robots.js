window.robots = Backbone.Collection.extend({
	model: robotModel,
	initialize: function(){
		Backbone.Events.on('robotLocChange', function(){
			console.log('Collection sees change: clear lastMove')
			this.forEach(function(value, key, list){
				value.set('lastMoveDir', undefined);
			});
		}, this);
	}
});