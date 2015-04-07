var startDialog = function(viewsToRender, parentModel, test){
    //Test set of players, saving development time when drawing complex shapes on canvas
    if(test){
        var playerNames = ["Zephanaiah", "Raghuvir", "Alpheus", "Sze-Hung"];
        parentModel.set('newPlayerNames', playerNames);
        parentModel.set('numPlayers', 4);
        _.each(viewsToRender, function(view){
            view.render();
        });
        Backbone.Events.trigger('newGame', [true]);
    } else{
    //Open first Dialog, which either sends the player to an input screen for player names...
    vex.dialog.open({
      message: 'Let\'s play Ricochet Robots! \n How many players?',
      input: "<input name=\"players\" type=\"number\" max=\"5\" min=\"1\" placeholder=\"1\" required />",
      buttons: [
        $.extend({}, vex.dialog.buttons.YES, {
          text: 'That many players!'
        }), $.extend({}, vex.dialog.buttons.NO, {
          text: '¯\\\(°_o)/¯  - How do I play?'
        })
      ],
      callback: function(data) {
        if (data === false) {
          //Or, allows the player to view instructions...
          var instructions = new instructionsView({
            el: $('#instructions')
          }).render();
          return;
        }
        var inputTemplate = ['<div> <input class=\"nameDisplay\"name=\"players\"', ' type=\"text\" placeholder=\"Player Name\" required/> </div>'];
        var numPlayers = data.players
        var inputHTML = ""
        for (var i = 1 ; i <= data.players; i++){
          inputHTML += inputTemplate[0] + i + inputTemplate[1];
        }
        vex.dialog.open({
          message: "What are your players' names?",
          input: inputHTML,
          buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'GO!!!'
            })
          ],
          /**
           * Input, an object, 'data', for which data.players holds an array of strings.
           * @return {[type]} [description]
           */
          callback: function(data) {
            var playerNames = [];
            for (var i = 0 ; i < data.players.length; i++){
              playerNames.push(data.players[i]);
            }
            parentModel.set('newPlayerNames', playerNames);
            parentModel.set('numPlayers', numPlayers);

            //Render the app's views, now that all required player information is present.
            _.each(viewsToRender, function(view){
                view.render();
            });
            Backbone.Events.trigger('newGame');

            //Css that modifis bootstrap...could be refactored out.
            $('body').css('background-color', '#D4D7C7');
            $('#credits').remove();
          }
        });
      }
    });
    }
};