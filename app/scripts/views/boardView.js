window.boardView = Backbone.View.extend({
  template: _.template($('#boardViewTemplate').html()),
  //Boardview keeps track of the active robot, for scorekeeping and animation.
  initialize: function(){
  	this.model.on('change:activeRobot',this.newActiveRobot, this);
  },
  render: function() {
    this.$el = this.template(this.model.attributes);
    return this.$el;
  }
});
