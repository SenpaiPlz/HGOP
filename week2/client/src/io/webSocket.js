module.exports= function webSocket(injected){
    const io = injected("io");
    const socketURI = injected("socketURI");

    const socket = io.connect(socketURI);
    return {
        emit:socket.emit.bind(socket),
        on:socket.on.bind(socket),
        disconnect: function () {
            socket.disconnect();
        }
    };
};