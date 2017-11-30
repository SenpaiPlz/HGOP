const express = require('express');
const redis = require('redis');

var port = 3000;
var app = express();
var client = redis.createClient(6379, 'my_redis_container', {
    retry_strategy: (options) => {
        return;
    }
});

app.get('/', (req, res) => {
    if (client.connected) {
        client.incr('page_load_count', (error, reply) => {
            var msg = 'Connected to redis, you are awesome :>' +
                      'Page loaded ' + reply + ' times!\n';
            res.statusCode = 200;
            res.send(msg);
            return;
        });
    } else {
        var msg = "Failed to connect to redis :\"\<\n";
        res.statusCode = 500;
        res.send(msg)
    }
});

app.listen(port);
