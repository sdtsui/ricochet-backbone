window.players = Backbone.Collection.extend({
	model: playerModel,
	initialize: function(){
		Backbone.Events.on('roundStart', function(){
			//	reset all bids
			this.forEach(function(value, key){
				value.resetBids();
			})
		}, this)
	}
});