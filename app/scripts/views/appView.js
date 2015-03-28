window.appView = Backbone.View.extend({
    events: {
      'click': 'sayHi'
    },
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
        // this.$el.append(this.playersView.render());

        this.scoreView = new scoreView({
            el: $('#scoreView'),
            model: this.model.get('scoreModel')})
        this.scoreView.render();
    },
    sayHi: function() {
    },
    appendRobots: function(){
        var robots = this.model.get('boardModel').get('robots');
        for(var i = 0 ; i < robots.length; i++){
            var newView = new robotView({model: robots.at(i)});
            var newElement = newView.render();
            $(this.$el[0]).append($(newElement)[0]);
        }
    }
});
