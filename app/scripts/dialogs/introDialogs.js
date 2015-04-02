var O = function(viewsToRender, parentModel, test){
    if(test){
        var playerNames = ["P1", "P2", "P3", "P4"];
        // console.log('Player Names :', playerNames);
        // console.log('rendering view. starting game...with', numPlayers, 'players.');
        parentModel.set('newPlayerNames', playerNames);
        parentModel.set('numPlayers', 4);

        _.each(viewsToRender, function(view){
            view.render();
        });
        Backbone.Events.trigger('newGame', [true]);

    } else{
        //Vex control flow:
    vex.dialog.open({
      message: 'Let\'s play Ricochet Robots! \n How many players?',
      input: "<input name=\"players\" type=\"number\" max=\"5\" min=\"1\" placeholder=\"1\" required />",
      buttons: [
        $.extend({}, vex.dialog.buttons.YES, {
          text: 'That many players!'
        }), $.extend({}, vex.dialog.buttons.NO, {
          text: 'I don\'t want to play...'
        })
      ],
      callback: function(data) {
        if (data === false) {
          return console.log('Placeholder function...redirect to something silly.');
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
          callback: function(data) {
            var playerNames = [];
            for (var i = 0 ; i < data.players.length; i++){
              playerNames.push(data.players[i]);
            }
            // console.log('Player Names :', playerNames);
            // console.log('rendering view. starting game...with', numPlayers, 'players.');
            parentModel.set('newPlayerNames', playerNames);
            parentModel.set('numPlayers', numPlayers);

            _.each(viewsToRender, function(view){
                view.render();
            });
            Backbone.Events.trigger('newGame');
          }
        });
      }
    });
    }
};