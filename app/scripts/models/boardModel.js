/*global RicochetBackbone, Backbone*/

RicochetBackbone.Models = RicochetBackbone.Models || {};

(function () {
    'use strict';

    RicochetBackbone.Models.BoardModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
