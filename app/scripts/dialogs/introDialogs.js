
//Core functionality in lines 69-80.
var startDialog = function(viewsToRender, parentModel, test){
    //Uses startDialog's closure to access parentModel, setting the players and names.
    //Also triggers render processes through viewsToRender.
    /**
    * Input, an object, 'data', for which data.players holds an array of strings.
    * @return {[type]} [description]
    */
    var diagMessages = ['Let\'s play Ricochet Robots! \n How many players?', "What are your players' names?"];
    var startGame = function(data) {
        var playerNames = [];
        for (var i = 0 ; i < data.players.length; i++){
            playerNames.push(data.players[i]);
        }
        parentModel.set('newPlayerNames', playerNames);
        parentModel.set('numPlayers', data.players.length);

        //Render the app's views, now that all required player information is present.
        _.each(viewsToRender, function(view){
            view.render();
        });
        test ? Backbone.Events.trigger('newGame', [true]) : Backbone.Events.trigger('newGame');

        //Remove instructions, fill in background color for game.
        $('body').css('background-color', '#D4D7C7');
        $('#credits').remove();
    }

    //Asks for number of players, passes that number in data to cb.
    var askForNumPlayers = function(cb){
        vex.dialog.open({
            message: diagMessages[0],
            input: "<input name=\"players\" type=\"number\" max=\"5\" min=\"1\" placeholder=\"1\" required />",
            buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
                text: 'That many players!'
            }), $.extend({}, vex.dialog.buttons.NO, {
                text: '¯\\\(°_o)/¯  - How do I play?'
            })
            ],
            callback: cb
        });

    }

    //Asks for X player names, where X is specified in data.
    //Uses createNameInputForm.
    var askForPlayerNames = function(data) {
        if (data === false) {
            renderInstructions();
            return;
        }
        var nameInput = createNameInputForm(data.players);

        //Open second dialogue, asking for names.
        vex.dialog.open({
            message: diagMessages[1],
            input: nameInput,
            buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
                text: 'GO!!!'
            })
            ],
            callback: startGame
        });
    }

    //Test set of players, saving development time when drawing complex shapes on canvas
    if(test){
        //Refactor into an invokation of startGame....
        var testInput = {
            players : ["Zephanaiah", "Raghuvir", "Alpheus", "Sze-Hung"]
        };
        startGame(testInput);

    } else{
        //Open first Dialog, which either sends the player to an input screen for player names...
        askForNumPlayers(askForPlayerNames);
    }
};

//Displays the instructions.
var renderInstructions = function(){
    var instructions = new instructionsView({
        el: $('#instructions')
    }).render();
};

//Generates an HTML string for a vex dialoge to display.
var createNameInputForm = function(players){
    var inputTemplate = ['<div> <input class=\"nameDisplay\"name=\"players\"', ' type=\"text\" placeholder=\"Player Name\" required/> </div>'];
    var inputHTML = ""
    for (var i = 1 ; i <= players; i++){
        inputHTML += inputTemplate[0] + i + inputTemplate[1];
    }
    return inputHTML;
}
