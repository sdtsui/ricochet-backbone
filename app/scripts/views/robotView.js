window.robotView = Backbone.View.extend({
    template: _.template(
        '<canvas class="<%= color %>" id="extra" width="40px" height="40px"></canvas>'
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
    //animate an activated robot...
    activate: function(){
        var props = this.model.attributes;
        var robot = $('.'+props.color);
            robot.toggleClass('rotated');
        setTimeout(function(){
            this.toggleClass('rotated');
        }.bind(robot),500);
    },
    setup: function(dir){
        var props = this.model.attributes;
        var boxSize = props.boxSize;

        //Model holds reference to the last clicked robot, to know which one to move.
        var robot = $('.'+props.color)
        robot.on('mousedown', function(selection){
            var activeRobotColor = props.color;
            rootModel.get('boardModel').set('activeRobot', activeRobotColor);
            this.activate();
        }.bind(this));

        var colors = rootModel.get('colorHex');
        var context = robot[0].getContext('2d');

        //Draw Ellipse one, outside the circular robot.
        context.beginPath();
        for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
            xPos = 20 - (10 * Math.sin(i)) * Math.sin(0.5 * Math.PI) + (20 * Math.cos(i)) * Math.cos(0.5 * Math.PI);
            yPos = 20 + (20 * Math.cos(i)) * Math.sin(0.5 * Math.PI) + (10 * Math.sin(i)) * Math.cos(0.5 * Math.PI);

            if (i == 0) {
                context.moveTo(xPos, yPos);
            } else {
                context.lineTo(xPos, yPos);
            }
        }
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.fillStyle = colors[props.color];
        context.closePath();
        context.stroke();
        context.fill();

        //Draw Ellipse two.
        context.beginPath();
        for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
            xPos = 20 - (10 * Math.sin(i)) * Math.sin(1 * Math.PI) + (20 * Math.cos(i)) * Math.cos(1 * Math.PI);
            yPos = 20 + (20 * Math.cos(i)) * Math.sin(1 * Math.PI) + (10 * Math.sin(i)) * Math.cos(1 * Math.PI);

            if (i == 0) {
                context.moveTo(xPos, yPos);
            } else {
                context.lineTo(xPos, yPos);
            }
        }
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.fillStyle = colors[props.color];
        context.closePath();
        context.stroke();
        context.fill();


        //Draw main large circle that represents robot.
        context.beginPath();
        context.fillStyle = colors[props.color];
        context.arc(20,20,16,0,Math.PI*2);
        context.fill()
        context.lineWidth = 1.5;
        context.strokeStyle = 'black';
        context.stroke();

        //Draw small arcs inside main circle.
        context.beginPath();
        context.arc(20,20,10,Math.PI*-.25,Math.PI*.25);
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();

        context.beginPath();
        context.arc(20,20,10,Math.PI*.75,Math.PI*1.25);
        context.stroke();

        //draw a circle inside, draw arcs inside the smaller circle
        //
        //LEFT:
        //Draw an ellipse, that stretches outside the robot
        //Draw a dot in the middle
        //Draw a thick arc
        //remove backgrounds..
        context.beginPath();
        context.lineWidth = 1;
        context.arc(20,20,3,0,Math.PI*2);
        context.stroke();
    },

    /**
    * Moves the robot to a location on the board canvas element, using the board's loc property.
    */
    move: function(){
        var props = this.model.attributes;
        var boxSize = props.boxSize;
        var robot = $('.'+props.color)
        robot.animate({
            top: (props.loc.row*boxSize+(boxSize*.1)+2),
            left: (props.loc.col*boxSize+(boxSize*.1)+2),
            width: boxSize*.8,
            height: boxSize*.8
        }, {duration: 150}, function(){});
    }
});