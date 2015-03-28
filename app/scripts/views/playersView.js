window.playersView = Backbone.View.extend({
	template: _.template('<div id="playersView" class="playerHolder"></div>'),
    initialize: function(){
    	console.log('PlayersView Init : ', this.model.length);
    	//for each model in players
    	//	create a new playerView
    	_.each(this.model.models, function(playerModel, idx){
    		console.log(idx, playerModel);
    		//create shit here
    	});
    },
    render: function(){
    }
})