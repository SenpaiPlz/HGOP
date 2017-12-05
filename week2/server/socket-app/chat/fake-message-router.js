module.exports=function () {
    let subscribe = function (eventType, callback) {
        me.subscriptions[eventType]=callback;
        return function () {
            me.unsubscribed = true;
        }
    };
    let me = {
        subscriptions:{},
        subscribe: subscribe,
        on:subscribe,
        subscribeMulti: function (subscriptions) {
            _.each(subscriptions, function (callback, key) {
                me.subscribe(key, callback);
            });
            return function () {
                me.unsubscribed = true;
            }
        },
        routeMessage: function (message) {
            me.subscriptions[message.type] && me.subscriptions[message.type](message);
        }
    };
    return me
};
