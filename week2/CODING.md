# JavaScript coding in this project

## No compiler - no type safety 

Tests to the rescue. One of the best features, and worst, of JavaScript, is that it employs Duck typing and has no
type safety. This means that correctness of code can only be determined at runtime, and a strong test suite is therefore
essential to get anything done.

So, before starting to change anything in this project, make sure you know how to run the tests in the project,
as explained in [README](README.md)

## 2 Types of objects/classes.

### Function closure scoped objects

The coding style in this project favours object composition over inheritance, as encouraged by the Clean Code movement.
As such, not much emphasis is on class inheritance in this project. One of the weaknesses of JavaScript has been its
inheritance model, but with object composition patterns, this is not an issue. 

As pointed out by the excellent book "JavaScript, the good parts", objects can easily be implemented using function
closures, as in the following block.

```
let constructor=function(){
    let privateVariable='thisIsPrivate';
    function doPrivateStuff(){
        // do whatever private stuff you want
    }
    
    let me ={
        publicVariable:'thisIsPublic',
        someSomethingUseful:function(newValue){
            doPrivateStuff();
            privateVariable=newValue;
            
        }
        
    }

}

let myObject=constructor();

myObject.publicVariable='usually not a good idea to expose variables like this';

myObject.someSomethingUseful('whatever');
```

This provides us with a better object construct that the one obtained using the ```new``` operator, and is the
preferred object style in this project.

## ECMAScript 6  (ES6) classes

The server code was mostly written before the advent of ECMAScript6. The client was rewritten to use React,
and thus uses a blend of the object approach above, and ES6/React classes. 

More on ES6 classes [here](http://exploringjs.com/es6/ch_classes.html).


## Dependency injection & unit testing
 
To facilitate depenency injection in this project, and increasing testability, it uses a not-so-widespread technique.
What this does for the code is to isolate imports/require to well defined parts of the code, and dramatically enhances
testability of all code. The result is more verbose code that is much more decoupled and therefore reusable. A good
example of this is the [routing context](client/src/routing-context.js) which is usable both in the browser client,
and in API testing.

DI support code:
- [Nano DI framework](client/src/common/framework/inject.js)


A few examples to look at:
### Server side 
- [Game command handler specs](server/socket-app/tictactoe/game-command-handler.spec.js)
- [Game command handler](server/socket-app/tictactoe/game-command-handler.js)


### Client side - React
- [Chat](client/src/chat/Chat.js)
- [Chat test](client/src/chat/Chat.test.js)

Note test/spec ending. test ending in client code, spec in server code. Different test runners used, Jest in
client, Jasmine in server.


 ### Thinking asynchronously

Asynchronous thinking is somewhat different from synchronous thinking, hence requires different coding patterns.

Avoid thinking in terms of request-response. Although still used quite a bit, the most effective patterns in 
asynchronous programming are based on pure dispatching (requests/commands/events) and pure receiving. 
To draw an analogy, think like you are communicating purely by SMS. You send a message, but you have no idea
when you get an answer, or whether you get an answer at all. 


There are two main ways to do async programming in JavaScript, those are using callback (original, traditional approach)
and promises, which is more modern and powerful, but also harder to debug, especially using the native implementations.

This project also uses a publish/subscribe model for asynchronous programming for message routing, as described below.

- [callbacks](http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/)
- [promises](https://developers.google.com/web/fundamentals/primers/promises)


## Message routing - socket.io  

The setup of this webapp is somewhat unusual in the regard is that it does not use XMLHttpRequest for client/server communication,
but relies entirely on full-duplex asynchronous SocketIO communication. 

Full duplex communication means that both server and client can decide to initiate message communication at any time
while the client is connected. However, only the client can initiate a connection to the server, essentially by opening
the web page serving the single page web app.

While not essential knowledge to do the projects in this course, you may find the following interesting,
which are the heart of the event/command routing used in this project.

The following implementations are used on both client and server side, for commands, events and query results.

* [Message router spec](client/src/common/framework/message-router.spec.js)
* [Incoming socket message dispatcher spec](client/src/common/framework/incoming-socket-message-dispatcher.spec.js)
* [Outgoing socket message port spec](client/src/common/framework/outgoing-socket-io-message-port.spec.js)


TODO: Add a schematic overview of message routing, commands and events. Whiteboard session until then.

## Fluent APIs

A fluent API, is a programming interface whose primary design objective is to make the calling code as
readable as possible.

- [Martin Fowler on Fluent Interfaces](https://martinfowler.com/bliki/FluentInterface.html)

Fluent APIs are particularly useful in building test APIs, which often revolve around building state, 
invoking some function, and then checking state.

A fluent API call for a test might look like this:

```    
user("One").expectChatMessageReceived('message two ')
           .sendChatMessage('message one ')

user("Two").expectChatMessageReceived('message one ')
           .sendChatMessage('message two ')
```

The technique for building fluent APIs is centered around the idea of returning the 
object from the function called, in order to be able to chain the calls easily.

```
function user(name){

    let me={
        expectChatMessageReceived:function(msg){
            ... add listener for the message
            return me;
        }
        sendChatMessage:function(msg){
            ... send the message
            return me;    
        }
    }
    return me;
}
```

When implementing asynchronous tests, a way to wait for messages must be added, like this:

```
function user(name){

   let me={
       expectChatMessageReceived:function(msg){
           ... add listener for the message
           return me;
       },
       sendChatMessage:function(msg){
           ... send the message
           return me;    
       },
       then(done){
            function waitLonger(){
                if(waitingFor.count()>0){
                    setTimeout(waitLonger, 0);
                    return;
                }
                done();
            }
            waitLonger();
            return me;
            
       }
   }
   return me;
}
``` 

and the calling code then looks like this:

```
user("Two").expectChatMessageReceived('message one ')
           .sendChatMessage('message two ').then(done)

```

The ```done``` function is provided by the test framework when performing asynchronous tests.



## Single page web-app
-  The client is a [Create React App](https://github.com/facebookincubator/create-react-app). The Readme is probably 
somewhat out of date, since the project was created 2 years ago. 