const IncomingSocketMessageDispatcher = require('./incoming-socket-message-dispatcher');

describe('socket message dispatcher', function(){
    let socket;
    let messageDispatcher;
    let router;
    let session;
    let subscription;
    let logEntries;

    beforeEach(function(){
        logEntries=[];

        socket = {
            _subscriptions: {},
            on: function (verb, callback) {
                socket._subscriptions[verb] = callback;
            },
            removeListener:function(verb, callback){
                delete socket._subscriptions[verb];
            }
        };

        router = {
            _dispatched:[],
            routeMessage:function(message){
                router._dispatched.push(message);
            }
        };

        session = {sessionId: 99};
        messageDispatcher = IncomingSocketMessageDispatcher(inject(
            {
                socketIoVerb:'issueCommand',
                messageRouter: router,
                incomingMessageLogger: function(verb, message){
                    logEntries.push({verb:verb, message:message})
                }
            }));
        subscription = messageDispatcher.startDispatching(socket, session);
    });

    it('should subscribe to commandIssued messages',function(){
        expect(socket._subscriptions['issueCommand']).toBeTruthy();
    });

    it('should route command object on commandIssued',function(){
        socket._subscriptions['issueCommand']({message:'dummy'});
        expect(router._dispatched.length).toBe(1);
        expect(router._dispatched[0].message).toBe("dummy");
    });

    it('should attach session object to message',function(){
        socket._subscriptions['issueCommand']({message:'dummy'});
        expect(router._dispatched.length).toBe(1);
        expect(router._dispatched[0].message).toBe("dummy");
        expect(router._dispatched[0]._session.sessionId).toBe(99);
    });

    it('should remove socket listener when stop dispatching called.',function(){
        subscription.stopDispatching();
        expect(socket._subscriptions['issueCommand']).toBeFalsy();
    });

    it('should log message to provided logger function.',function(){
        socket._subscriptions['issueCommand']({message:'dummy'});
        expect(logEntries.length).toBe(1);
        expect(logEntries[0].verb).toBe('issueCommand');
    });
});
