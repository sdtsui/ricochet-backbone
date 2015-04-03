window.scoreView = Backbone.View.extend({
	template: _.template($("#scoreViewTemplate").html()),
    initialize: function(){
    	this.model.on('change:timerValue change:activeMoves change:tokensRemaining', this.render, this)
    },
    render: function(){
    	this.$el.html(this.template(this.model.attributes));
    	return this.$el;
    }
});