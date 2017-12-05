const SocketIoEventPort = require('./outgoing-socket-io-message-port');


describe('outgoing socket io message port', function(){

    let loggedMessages;

    let fakeIo = {
        _emitted:{},
        emit: function(verb, message){
            fakeIo._emitted[verb] = fakeIo._emitted[verb] || [];
            fakeIo._emitted[verb].push(message);
        }
    };

    let fakeRouter = {
        _subscriptions:{},
        on:function(verb, callback){
            fakeRouter._subscriptions[verb]=callback;
        }
    };

    beforeEach(function(){
        loggedMessages=[];
        let ioPort = SocketIoEventPort(inject({
            io:fakeIo,
            messageRouter: fakeRouter,
            outgoingMessageLogger: function(verb, message){
                loggedMessages.push({verb:verb, message:message});
            }
        })) ;
        ioPort.dispatchThroughIo('*', 'eventIssued');
    });

    it('should subscribe to all messages routed through message router',function(){
        expect(fakeRouter._subscriptions['*'].length).toBe(1);
    });

    it('should emit event from socketIo server under eventIssued verb',function(){
        fakeRouter._subscriptions["*"]({message:"test message"});
        expect(fakeIo._emitted["eventIssued"].length).toBe(1);
    });

    it('should log outgoing message to provided logger function',function(){
        fakeRouter._subscriptions["*"]({message:"test message N"});
        expect(loggedMessages.length).toBe(1);
    });

});
