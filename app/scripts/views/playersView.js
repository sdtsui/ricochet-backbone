window.playersView = Backbone.View.extend({
	el: $('playersView'),
	events: {
		'click .btn' : function(e){
			e.preventDefault();
			var btn = $(e.currentTarget); 
			var id = btn.data('id');
			var bid = btn.siblings()[0].valueAsNumber;
			var player = this.model.get(id);
			player.set('newestBid', bid);
			// console.log("Bid Set : ", player.get('username'));
		},
	},
	playersViews : [],
	templStr : ['<div id="player-' , '<%= username >' , '" class="playerBox1"></div>'],
	scoreV: ['<div id="scoreView" class="scoreHolder"> </div>'],
	scoreViews : [],
	// template: _.template(),
    initialize: function(){
    	this.render();
    	//FIND THE DIVS, then assign them to EL, then render everything inside them.

    	//render first
    	//for each model in players, 
    	//	create a new playerView, assignin el to a div with an id corresponding to username
    	//	
    	//	
    	_.each(this.model.models, function(playerModel, idx){
    		// console.log(idx, playerModel);
    		var newView = new playerView({
    			model: playerModel,
    			el: $('#player-'+playerModel.get('username'))
    		});
    		this.playersViews.push(newView);
    	}.bind(this));

    	// this.scoreViews.push(new scoreView({
    	// 	el: $('#scoreView'),
    	// 	model: root
    	// }))

    	//those views will render upon instantiation
    },
    render: function(){
    	this.$el.children().detach();

    	//make all the new views..
    	_.each(this.model.models, function(playerModel, idx){
    		// var newView = new playerView({model: })
    		// this.playersViews.push(new playerView())
    		// console.log('append here!');
    		var userName = playerModel.get('username');
    		var htmlString = this.templStr[0] + userName + this.templStr[2];
    		this.$el.append(htmlString);
    		// this.model.models[idx].attributes
    	}.bind(this));
    	this.$el.append(this.scoreV);

    	//create the next models, append them to the el
    	//return this.$el
    }
    // captureBid: function(e){
    // 	console.log('e :',e);
    // 	console.log(e.target.offsetParent.localName)
    // 	if (e.target === 'button.btn.bid-btn'){
    // 		console.log('button!' + this.model.get('username'))
    // 	}else {
    // 		console.log('not button')
    // 	}
    // 	console.log('submit seen')
    // }
})