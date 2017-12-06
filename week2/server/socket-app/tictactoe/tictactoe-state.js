const _ = require('lodash');

module.exports = function (injected) {
    let gameState = undefined;

    return function (history) {
        function processEvent(event) {
            switch(event.type){
                case "GameCreated":
                    gameState = {   full: false,
                                    nextPlayIsX:  true,
                                    board: [['','',''],['','',''],['','','']]
                                };

                case "JoinGame":
                    gameState.full = true;
                    break;
                case "PlaceMove":
                    gameState.board[event.x][event.y] = event.side;
                    gameState.nextPlayIsX = !gameState.nextPlayIsX;
                    break;
                default: break
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull(){
            return gameState.full;
        }

        function nextSide(){
            return gameState.nextPlayIsX === true ? 'X' : 'O';
        }

        function sqrIsEmpty(x,y){
            return gameState.board[x][y] === '';
        }

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull,
            nextSide: nextSide,
            sqrIsEmpty: sqrIsEmpty
        }
    };
};
