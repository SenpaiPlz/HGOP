const express = require('express');
const redis = require('redis');
const database = require('./database');

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

//GET url/items
app.get('/items', (req, res) => {
    // Call the database.get method implemented in database.js
    database.get((data) => {
        // should never return an error as the query is hardcoded atm
        res.statusCode = 200;
	    res.send(data);
    })
});

//POST url/items/:name
app.post('/items/:name', (req, res) => {
    // get the name from the request
    var name = req.params.name;
    // call the database.insert method implemented in database.js with the name and Date.now()
    database.insert(name, Date.now(), (err) => {
        // Should never throw an error but check it anyways
        if(err)
            console.log(err);
        // Send the statuscode 201 - created
        res.sendStatus(201);
    });
});

app.listen(port);
