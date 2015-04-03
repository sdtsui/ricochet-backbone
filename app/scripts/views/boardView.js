window.boardView = Backbone.View.extend({
  template: _.template($('#boardViewTemplate').html()),
  	// '<canvas id="boardCanvas" width="<%= boardWidth %>" height="<%= boardWidth %>" style="background: #fff;"></canvas>'
  events: {
  },
  initialize: function(){
  	this.model.on('change:activeRobot',this.newActiveRobot, this);
  },
  render: function() {
    this.$el = this.template(this.model.attributes);
    return this.$el;
  },
  newActiveRobot: function(){
    //placeholder function for re-rendering a robot
  }
});
