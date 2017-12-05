module.exports=function(injected){

    const io = injected('io');
    const incomingSocketMessageDispatcher = injected('incomingSocketMessageDispatcher');
    const OutgoingSocketIoMessagePort = injected('OutgoingSocketIoMessagePort');
    const queryRouter = injected('queryRouter');

    let clientCounter = 0;
    let numClients = 0;

    const sessions = {};
    const users = {};

    function trackClient(clientId, socket) {

        let anonymousUser = {
            userName: "Anonymous#" + clientId,
            userId:clientId
        };
        const newUserSession = {
            clientId:clientId,
            user: anonymousUser
        };
        users[anonymousUser.userId] = anonymousUser;

        io.emit('sessionJoined', newUserSession);
        socket.emit('sessionAck', newUserSession); //
        numClients++;
        emitStats();

        const dispatcher = incomingSocketMessageDispatcher.startDispatching(socket, newUserSession);

        sessions[clientId] = newUserSession;
        socket.emit('sessionsConnected', sessions);

        socket.on('disconnect', ()=>{
            io.emit('sessionDisconnected', {clientId, message : "User left the party"});
            numClients--;
            emitStats();
            dispatcher.stopDispatching(socket);
            delete sessions[clientId];
        });

        socket.on('changeUserName', function(userNameChange){
            sessions[clientId].user.userName=userNameChange.userName;
            io.emit('sessionChanged', sessions[clientId])
        });

        socket.on('reconnectUser', function(clientInfo){

            if(users[clientInfo.userId]){
                users[sessions[clientId]] && delete users[sessions[clientId]];
                sessions[clientId].user=users[clientInfo.userId];
            } // else previous username is lost due to server restart.

            io.emit('sessionChanged', sessions[clientId])
        });

        const queryResultPort = OutgoingSocketIoMessagePort
        (inject({
            io:socket,
            messageRouter:queryRouter
        }));

        const dispatchOnlyToOriginFilter = function(message){
            return message.requestCommand._session.clientId===clientId;
        };

        queryResultPort.dispatchThroughIo('*', 'queryResult', dispatchOnlyToOriginFilter);
    }


    function emitStats() {
        io.emit('stats', {numClients: numClients});
    }

    io.on('connection', function(socket){
        trackClient(clientCounter++, socket);
    });
};