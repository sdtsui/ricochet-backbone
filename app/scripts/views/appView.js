window.appView = Backbone.View.extend({
  // template: _.template('<div id="appView">App</div>'),
  events: {
    'click': 'sayHi'
  },

  render: function() {
  	//Render everything from here.
	// this.$el.append(this.template({}));
	var board = this.model.get('boardModel');
	this.$el.append(new boardView({model: board}).render());
    return this;

  },
  sayHi: function() {
    console.log('Hi!');
  }
});