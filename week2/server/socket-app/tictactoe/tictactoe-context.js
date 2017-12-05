const TictactoeState = require('./tictactoe-state');
const Tictactoe = require('./tictactoe-game');
const GameHandler = require('./game-command-handler');
const CacheModule = require('./cache');

module.exports=function(injected) {
    const generateUUID=injected('generateUUID');
    const commandRouter=injected('commandRouter');
    const eventRouter=injected('eventRouter');
    const eventStore= injected('eventStore');

    const tictactoe = Tictactoe(inject({
        TictactoeState:TictactoeState(inject({}))
    }));

    let gameHandler = GameHandler(inject({
        generateUUID,
        commandRouter,
        eventRouter,
        eventStore,
        aggregate:tictactoe,
        Cache: CacheModule(inject(
            {cacheSize:100}
        ))
    }));

    return {
        commandHandler:gameHandler
    }

};