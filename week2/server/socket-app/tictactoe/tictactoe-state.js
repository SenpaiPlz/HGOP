const _ = require('lodash');

const gameState = { full: false,
                    nextPlayIsX:  true
                  };

module.exports = function (injected) {

    return function (history) {
        function processEvent(event) {
            switch(event.type){
                case "JoinGame":
                    gameState.full = true;
                    break;
                case "PlaceMove":
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
            return gameState.nextPlayIsX ? 'X' : 'O';
        }

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull,
            nextSide: nextSide
        }
    };
};
