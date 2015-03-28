window.scoreView = Backbone.View.extend({
	template: _.template($("#scoreViewTemplate").html()),
    initialize: function(){
    	console.log('scoreView Init')
    	this.model.on('change:timerValue', this.render, this)
    },
    render: function(){
    	this.$el.html(this.template(this.model.attributes));
    	return this.$el;
    }
});