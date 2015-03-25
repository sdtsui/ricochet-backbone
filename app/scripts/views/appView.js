window.appView = Backbone.View.extend({
    events: {
      'click': 'sayHi'
    },
    render: function() {
        var board = this.model.get('boardModel');
        this.$el.append(new boardView({model: board}).render());
        this.appendRobots();
        Backbone.Events.trigger('boardAssetsRendered');
        return this;
    },
    sayHi: function() {
    },
    appendRobots: function(){
        var robots = this.model.get('boardModel').get('robots');
        // console.log('rendering robots :', robots);
        for(var i = 0 ; i < robots.length; i++){
            // debugger;
            // console.log('robots.get i', robots.at(i));
            var newView = new robotView({model: robots.at(i)});
            // console.log('newView : ', newView);
            var newElement = newView.render();
            // console.log('newElement : ', newElement);
            // console.log($(newElement)[0]);
            $(this.$el[0]).append($(newElement)[0]);
            // this.$el.append(newElement);
            // $(document).append($(newElement));
        }

    }
});