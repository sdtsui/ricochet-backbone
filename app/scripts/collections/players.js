window.players = Backbone.Collection.extend({
	model: playerModel,
	initialize: function(){
		Backbone.Events.on('gameStart', function(){
			console.log('players collection sees gameStart!');
		}, this)
	}
});