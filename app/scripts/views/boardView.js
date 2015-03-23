/*global RicochetBackbone, Backbone, JST*/
var boardViewTemplate = require("./templates/boardView.ejs");
console.log ('bvT run')
RicochetBackbone.Views = RicochetBackbone.Views || {};

(function () {
    'use strict';
    console.log("BoardView: ", boardView)Template;

    RicochetBackbone.Views.BoardView = Backbone.View.extend({

        template: "",

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }

    });

})();
