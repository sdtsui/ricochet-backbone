window.instructionsView = Backbone.View.extend({
	template: _.template($('#instructionsTemplate').html()),
	initialize: function(){},
	render: function(){
    	this.$el.html(this.template());
    	return this.$el;
    }
});