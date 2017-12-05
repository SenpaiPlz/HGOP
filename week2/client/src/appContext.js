import inject from './common/framework/inject';

import generateUUID from 'common/framework/uuid';

import AppModule from 'App';
import ConnectedClientsModule from 'status/ConnectedClients';
import ConnectedUsersModule from 'status/ConnectedUsers';
import ChatModule from 'chat/Chat';
import RoutingContext from './routing-context';

import TictacToeContext from './tictactoe/tictactoe-context';
import CurrentUserTracker from './user/current-user-tracker';

import qs from 'query-string';
import createHistory from 'history/createBrowserHistory'

function appContext(injected){
    const io = injected('io');
    const env = injected('env');

    const {eventRouter, commandRouter, queryRouter, socket} = RoutingContext(inject({io, env}));

    const ConnectedClients = ConnectedClientsModule(inject({
        socket
    }));

    const currentUserTracker=CurrentUserTracker(inject({
        qs,
        createHistory
    }));

    const ConnectedUsers = ConnectedUsersModule(inject({
        socket,
        currentUserTracker
    }));

    const Chat = ChatModule(inject({
        commandPort:commandRouter,
        eventRouter,
        queryRouter,
        generateUUID: generateUUID
    }));

    const {TictactoeGame} = TictacToeContext(inject({
        eventRouter,
        commandRouter,
        queryRouter,
        socket,
        currentUserTracker
    }));

    const App = AppModule(inject({
        io,
        ConnectedClients,
        ConnectedUsers,
        Chat,
        TictactoeGame,
        socket,
        eventRouter
    }));

    let exports = {
        App
    };

    return exports;

}

export default appContext;