export default function () {
    let io = {
        _connectedTo: undefined,
        connect: function (url) {
            io._connectedTo = url;
            return { // socket
                on: function (eventName) {

                },
                emit:function(){

                }
            }
        }
    };
    return io;
};