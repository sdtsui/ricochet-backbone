window.boardView = Backbone.View.extend({
  template: _.template('<canvas id="boardCanvas" width="<%= boardWidth %>" height="<%= boardWidth %>" style="background: #fff;  magrin:20px;"></canvas>'),

  events: {
  },
  render: function() {
    console.log("Model Attr : " ,this.model.attributes);
    this.$el = this.template(this.model.attributes);
    return this.$el;
  }
});