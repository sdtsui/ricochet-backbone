window.playerView = Backbone.View.extend({
	template: _.template($('#playerViewTemplate').html()),
    initialize: function(){
    	this.model.on('change:currentBid', this.render, this);
    	this.render();
    },
    render: function(){
    	console.log('rerendering...');
    	this.$el.html(this.template(this.model.attributes));
    	return this.$el;
    }
});