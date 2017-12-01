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

module.exports = {
    insert: (name, insertDate, cb) => {
        var client = getClient();
        client.connect(() => {
            client.query('INSERT INTO Item (Name, InsertDate) VALUES (\'' + name + '\', to_timestamp(' + insertDate/1000 + '));', (err) => {
                client.end();
                if(err)
                    cb(err);
		cb();
            })
        })
    },
    get: (cb) => {
        var client = getClient();
        client.connect(() => {
            client.query('SELECT Name FROM Item ORDER BY InsertDate DESC LIMIT 10;', (err, data) => {
                client.end();
                if(err)
                    cb(err);
                else
                    cb(data.rows.map(x => x.name));
            })
        })
    }
}
