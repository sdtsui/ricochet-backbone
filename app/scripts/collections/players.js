window.players = Backbone.Collection.extend({
	model: playerModel,
	initialize: function(){
		Backbone.Events.on('roundStart', function(){
			console.log('players collection sees roundStart!');
			//	reset all bids to 'none'
			this.forEach(function(value, key){
				value.resetBids();
			})
		}, this)
	}
});