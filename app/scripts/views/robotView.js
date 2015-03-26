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
    // console.log('in view: this.model.attributes', this.model.attributes);
    return this.template(this.model.attributes);
    // console.log('appending...');
  },
  activate: function(){

  },
  setup: function(dir){
    var props = this.model.attributes;
    // console.log('props :', props);
    var boxSize = props.boxSize;
    var robot = $('.'+props.color).on('mousedown', function(selection){
      /**
       * emit a robot clicked event to the model
       * 
       */
      var activeRobot = props.color;
      // console.log('Old Active :', appModel.get('boardModel').get('activeRobot') )
      appModel.get('boardModel').set('activeRobot', activeRobot);
      // console.log('New Active: set' );
    });
    var context = robot[0].getContext('2d')
    context.fillStyle = 'white';
    context.font = '20px serif'
    context.fillText("R",boxSize/4,boxSize/2);
  },
  move: function(){
    var props = this.model.attributes;
    var boxSize = props.boxSize;
    var robot = $('.'+props.color)
    robot.animate({
        top: 8+(props.loc.row*boxSize+(boxSize*.3)),
        left: 8+(props.loc.col*boxSize+(boxSize*.3)),
        width: boxSize/2,
        height: boxSize/2
    }, {duration: 150}, function(){});
  }
});