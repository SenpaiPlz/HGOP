const _ = require('lodash');


module.exports = function (settings) {
    const routingKey = (settings && settings.routingKey) || "type";
    const listeners = {};

    let subscribe = function (routingKeyValue, callback) {
        listeners[routingKeyValue] = listeners[routingKeyValue] || [];
        listeners[routingKeyValue].push(callback);
        return function () {
            // eslint-disable-next-line
            messageRouter.unsubscribe(routingKeyValue, callback);
        }
    };

    let messageRouter = {
        subscribe: subscribe,
        on: subscribe,
        subscribeMulti: function (listeners) {
            let unsubscribers = [];
            _.each(listeners, function (callback, routingKey) {
                unsubscribers.push(messageRouter.on(routingKey, callback));
            });
            return function () {
                _.each(unsubscribers, function (unsubscribe) {
                    unsubscribe();
                });
            }
        },
        routeMessage: function (message) {
            let routingValue = message[routingKey];
            if (routingValue === '*') {
                console.log("WARNING: Event router routing message that has special value * in its routing key attribute! ", message);
            }

            function routeMessage(routingValue, message) {
                if (listeners[routingValue]) {
                    _.each(listeners[routingValue], function (listener) {
                        try {
                            listener(message);
                        } catch (e) {
                            console.error("Error while routing ", message, " to ", listener, ": ", e);
                            throw e;
                        }
                    });
                }
            }

            routeMessage(routingValue, message);
            routeMessage('*', message);
        },
        unsubscribe: function (routingKey, callback) {
            if (listeners[routingKey]) {
                let idx = listeners[routingKey].indexOf(callback);
                listeners[routingKey].splice(idx, 1);
            }
        }
    };

    return messageRouter;
};