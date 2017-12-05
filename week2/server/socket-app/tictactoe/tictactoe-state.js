const _ = require('lodash');

module.exports = function (injected) {

    return function (history) {
        function processEvent(event) {
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull(){
            return false;
        }        

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull
        }
    };
};
