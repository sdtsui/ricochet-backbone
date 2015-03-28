window.robotView = Backbone.View.extend({
  template: _.template(
    '<canvas class="<%= color %>" id="extra" width="25px" height="25px">R</canvas>'
    ),
  events: {
  },
  initialize: function(){
    this.model.on('change:boxSize', function(){
      this.setup();
      this.move();
    }, this);
    this.model.on('change:loc', this.move, this);
  },
  render: function(){
    return this.template(this.model.attributes);
  },
  activate: function(){
  },
  setup: function(dir){
    var props = this.model.attributes;
    var boxSize = props.boxSize;

    //Model holds reference to the last clicked robot, to know which one to move.
    var robot = $('.'+props.color).on('mousedown', function(selection){
      var activeRobot = props.color;
      rootModel.get('boardModel').set('activeRobot', activeRobot);
    });

    //Placeholder code to draw a symbol on the canvas for one robot. *break off into a fn*
    var context = robot[0].getContext('2d')
    context.fillStyle = 'white';
    context.font = '20px serif'
    context.fillText("R",boxSize/4,boxSize/2);
  },

  /**
   * Moves the robot to a location on the board canvas element, using the board's loc property.
   */
  move: function(){
    var props = this.model.attributes;
    var boxSize = props.boxSize;
    var robot = $('.'+props.color)
    robot.animate({
        top: (props.loc.row*boxSize+(boxSize*.3)),
        left: (props.loc.col*boxSize+(boxSize*.3)),
        width: boxSize/2,
        height: boxSize/2
    }, {duration: 150}, function(){});
  }
});