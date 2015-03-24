window.appView = Backbone.View.extend({
    events: {
      'click': 'sayHi'
    },
    render: function() {
        var board = this.model.get('boardModel');
        this.$el.append(new boardView({model: board}).render());
          return this;
    },
    sayHi: function() {
    }
});