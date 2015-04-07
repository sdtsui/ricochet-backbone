window.playersView = Backbone.View.extend({
	el: $('playersView'),
	events: {
		'click .bid-btn' : 'clickBidBtn',
        'keypress :input': 'keyDown'
	},
    /**
     * Following three functions associate the right user inputs with the right players' elements, by id, using a given element's siblings.
     */
    clickBidBtn: function(e){
        e.preventDefault();
        var btn = $(e.currentTarget); 
        var id = btn.data('id');
        var bid = btn.siblings()[0].valueAsNumber;
        this.triggerBid(bid, id);
    },
    keyDown: function(e){
        if (e.keyCode === 13){
            var input = $(e.currentTarget);
            var id = input.siblings().data('id');
            var bid = input[0].valueAsNumber;
            this.triggerBid(bid, id);
        }
    },
    triggerBid : function(bid, id){
        if ((bid-bid === 0) && (bid <= 99) ){
            Backbone.Events.trigger('newBidEvent', [bid]);
            var player = this.model.get(id);
            player.trigger('newBidEvent', [bid]);                
        }
    },
	playersViews : [],
	templStr : ['<div id="player-' , '<%= username >' , '" class="playerBox1"></div>'],
	scoreV: ['<div id="scoreView" class="scoreHolder"> </div>'],
	scoreViews : [],
    initialize: function(){
    	this.render();
    	_.each(this.model.models, function(playerModel, idx){
    		var newView = new playerView({
    			model: playerModel,
    			el: $('#player-'+playerModel.get('username'))
    		});
    		this.playersViews.push(newView);
    	}.bind(this));
    },
    render: function(){
    	this.$el.children().detach();

    	//make all the new views..
    	_.each(this.model.models, function(playerModel, idx){
    		var userName = playerModel.get('username');
    		var htmlString = this.templStr[0] + userName + this.templStr[2];
    		this.$el.append(htmlString);
    	}.bind(this));
    	this.$el.append(this.scoreV);
    }
})