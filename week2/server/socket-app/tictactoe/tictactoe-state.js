const _ = require('lodash');

const gameState = {full: false};

module.exports = function (injected) {

    return function (history) {
        function processEvent(event) {
            switch(event.type){
                case "JoinGame":
                    gameState.full = true;
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull(){
            return gameState.full;
        }        

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull
        }
    };
};
