window.playerView = Backbone.View.extend({
    initialize: function(){
    	this.model.bind('change', this.render, this);
    	this.render();
    },
    render: function(){
    	this.$el.html(this.template());
    }
});