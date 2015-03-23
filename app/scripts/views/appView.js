/*global RicochetBackbone, Backbone, JST*/

RicochetBackbone.Views = RicochetBackbone.Views || {};

(function () {
    'use strict';

    RicochetBackbone.Views.AppView = Backbone.View.extend({

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
