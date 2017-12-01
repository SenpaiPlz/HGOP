const { Client } = require('pg');

function getClient() {
    return new Client({
        host: "postgres",
        user: "test",
        password: "test",
        database: "test_db"
    });
}

function initialize() {
    var client = getClient();
    client.connect(() => {
        client.query('CREATE TABLE IF NOT EXISTS Item (ID SERIAL PRIMARY KEY, Name VARCHAR(32) NOT NULL, InsertDate TIMESTAMP NOT NULL);', (err) => {
            console.log('successfully connected to postgres!')
            client.end();            
        });
    });
}

// give the postgres container a couple of seconds to setup.
setTimeout(initialize, 10000);

// export the following functions: insert(name, insertDate, cb) and get(cb)
module.exports = {
    insert: (name, insertDate, cb) => {
        // Get the client
        var client = getClient();
        // connect to the postgres server
        client.connect(() => {
            // query the server
            client.query('INSERT INTO Item (Name, InsertDate) VALUES (\'' + name + '\', to_timestamp(' + insertDate/1000 + '));', (err) => {
                // shutdown the client connection
                client.end();

                // should never return err, as the query is hardcoded
                if(err)
                    cb(err);

                // invoke the callback
                cb();
            })
        })
    },
    get: (cb) => {
        // Get the client
        var client = getClient();
        // connect to the postgres server
        client.connect(() => {
            // query the server
            client.query('SELECT Name FROM Item ORDER BY InsertDate DESC LIMIT 10;', (err, data) => {
                // shutdown the client connection
                client.end();

                // should never return an err, as the query is hardcoded
                if(err)
                    cb(err);
                else
                    // invoke the callback with the data retrieved
                    cb(data.rows.map(x => x.name));
            })
        })
    }
}
