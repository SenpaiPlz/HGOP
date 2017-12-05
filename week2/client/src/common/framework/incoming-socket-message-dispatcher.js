module.exports=function(injected){
    const socketIoVerb = injected('socketIoVerb');
    const messageRouter = injected('messageRouter');

    const incomingMessageLogger = injected('incomingMessageLogger', true);

    return {
        startDispatching: function(_socket, _session){
            let socket = _socket;
            let session = _session;

            let listener;
            listener = (message)=>{
                message._session = session;
//                 console.debug("Incoming message from socket.io: " + socketIoVerb + " message: ", message );

                if(incomingMessageLogger){
                    incomingMessageLogger(socketIoVerb, message);
                }

                messageRouter.routeMessage(message);
            };

            socket.on(socketIoVerb, listener);
            return {
                stopDispatching:function(){
                    socket.removeListener(socketIoVerb, listener);
                }
            }
        }
    };
};