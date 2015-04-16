var findBoardDimensions = function(){
    var windowWidth     = $(window).width();
    var windowHeight    = $(window).height(); 
    var boardWidth = 
    (windowWidth <= windowHeight) ? windowWidth : windowHeight;
    boardWidth *= 0.95; 
    return {
        windowWidth     : windowWidth,
        windowHeight    : windowHeight,
        boardWidth      : boardWidth
    }
}

//instantiates the root models and associated views, starts initial user dialog.
//adds jQuery input listeners
$(document).on('ready', function(){
    var boardDimensions = findBoardDimensions();
    //Instantiate the main appModel instance.
    window.rootModel = new appModel({
        windowWidth : boardDimensions.windowWidth,
        windowHeight : boardDimensions.windowHeight,
        boardWidth : boardDimensions.boardWidth
    });
    var APPDIV = new appView({
        model: rootModel,
        el: $('#appView')
    });
    //**This can be abstracted back into the backbone model...**
    //Draw on canvas.
    window.boardDetails = new canvasDrawView({
        model: rootModel
    });

    // Last param of this function allows for fast rendering of 4 players
    startDialog([APPDIV, boardDetails], rootModel, false);

});

//condense this into a clickhandler function to put into boardView eventually,
//makes more sense there than in a random script
$(document).on('ready', function(){
    $(document.body).on('keydown', function(e){
        //only act if there is an active player to win the point...
        if (rootModel.get('scoreModel').get('activePlayer') !== undefined){
            var keyCode = e.keyCode;
            if ((e.keyCode === 38) ||(e.keyCode === 87)){
                Backbone.Events.trigger('keyN');
            } else if ((e.keyCode === 40) ||(e.keyCode === 83)) {
                Backbone.Events.trigger('keyS');
            } else if ((e.keyCode === 39) ||(e.keyCode === 68)) {
                Backbone.Events.trigger('keyE');
            } else if ((e.keyCode === 37) ||(e.keyCode === 65)) {
                Backbone.Events.trigger('keyW');
            } 
        }
    });
})