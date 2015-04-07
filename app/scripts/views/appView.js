window.appView = Backbone.View.extend({
    //Attaches main view to the assigned $el.
    render: function(num) {
        var board = this.model.get('boardModel');
        $(this.$el).children().detach();
        this.boardView = new boardView({model: board});
        this.$el.append(this.boardView.render());
        this.appendRobots();
        Backbone.Events.trigger('boardAssetsRendered');
        this.playersView = new playersView({
            model :this.model.get('players'),
            el: $('#playersView')
        });
        this.scoreView = new scoreView({
            el: $('#scoreView'),
            model: this.model.get('scoreModel')})
        this.scoreView.render();
    },
    //Adds a new html canvas on top of 
    //Decision to go with a new HTML canvas influenced by original scope: only needed simple animations.
    //Made the most sense at the time spin the canvas elements using jQuery instead of creating 
    //an animation function on the canvas.
    //
    appendRobots: function(){
        var robots = this.model.get('boardModel').get('robots');
        for(var i = 0 ; i < robots.length; i++){
            var newView = new robotView({model: robots.at(i)});
            var newElement = newView.render();
            $(this.$el[0]).append($(newElement)[0]);
        }
    }
});
