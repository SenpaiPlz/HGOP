export default function(){
    let socket= {
        listeners:{},
        emitted:[],
        on: function(event, callback){
            socket.listeners[event] = callback;
        },
        emit: function(verb, message){
            socket.emitted.push({verb:verb, message:message});
        }
    };
    return socket;
}