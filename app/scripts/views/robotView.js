window.robotView = Backbone.View.extend({
  template: _.template(
    '<canvas class="<%= color %>" id="extra" width="25px" height="25px">R</canvas>'
    ),
  events: {
  },
  initialize: function(){
    this.model.on('updateRobotPosition', this.move, this);
  },
  render: function(){
    // console.log('in view: this.model.attributes', this.model.attributes);
    return this.template(this.model.attributes);
    // console.log('appending...');
  },
  activate: function(){

  },
  move: function(dir){
    var props = this.model.attributes;
    var boxSize = 19.9
    console.log('props:', props);
    var robot = $('.'+props.color);
    robot[0].getContext('2d').fillText("Robot",10,10);
    robot.animate({
        top: 8+(props.row*boxSize),
        left: 8+(props.col*boxSize)
    }, {duration: 500}, function(){
        console.log('done animating');
    });
  }
});