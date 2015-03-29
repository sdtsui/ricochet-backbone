window.playerView = Backbone.View.extend({
	template: _.template($('#playerViewTemplate').html()),
    initialize: function(){
    	this.model.on('change:currentBid change:tokensWon', this.render, this);
    	this.render();
    },
    render: function(){
    	this.$el.html(this.template(this.model.attributes));
    	return this.$el;
    }
});