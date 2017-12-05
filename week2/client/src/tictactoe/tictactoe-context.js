import inject from '../common/framework/inject';

import qs from 'query-string';
import createHistory from 'history/createBrowserHistory'

import TictactoeGameModule from './TictactoeGame';
import TictactoeBoardModule from './TictactoeBoard';
import TictactoeMessageModule from './TictactoeMessage';
import TicCellModule from './TicCell';
import MessageRouter from '../common/framework/message-router';
import CurrentGameTrackerModule from './current-game-tracker';

import generateUUID from '../common/framework/uuid';


function TictactoeContext(injected){
    const eventRouter = injected('eventRouter');
    const commandRouter = injected('commandRouter');
    const queryRouter = injected('queryRouter');
    const socket = injected('socket');
    const currentUserTracker = injected('currentUserTracker');

    const currentGameTracker = CurrentGameTrackerModule(inject({
        qs,
        createHistory
    }));

    const TicCell = TicCellModule(inject({
        eventRouter,
        commandPort:commandRouter,
        generateUUID
    }));

    const TictactoeMessage = TictactoeMessageModule(inject({
        eventRouter,
        MessageRouter
    }));

    const TictactoeBoard = TictactoeBoardModule(inject({
        TictactoeMessage,
        TicCell,
        eventRouter,
        MessageRouter
    }));


    const TictactoeGame = TictactoeGameModule(inject({
        TictactoeBoard,
        TictactoeMessage,
        eventRouter,
        commandPort:commandRouter,
        queryRouter,
        generateUUID,
        socket,
        currentUserTracker,
        currentGameTracker
    }));

    return {
        TictactoeGame
    };
}

export default TictactoeContext;