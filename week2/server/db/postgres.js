const pg = require('pg');

module.exports=function(injected){

// create a config to configure both pooling behavior
// and connection options
// note: all config is optional and the environment variables
// will be read if the config is not present
    let config = injected('config');

/*
    {
        user: 'postgres', //env var: PGUSER
        database: 'postgres', //env var: PGDATABASE
        password: 'mysecretpassword', //env var: PGPASSWORD
        port: 5432, //env var: PGPORT
        max: 10, // max number of connections in the pool
        idleTimeoutMillis: 30000 // how long a connection is allowed to remain idle before being closed
    };
*/



//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle connections
    let pool = new pg.Pool(config);

// to run a query we can acquire a connection from the pool,
// run a query on the connection, and then return the connection to the pool
    pool.connect(function(err, connection, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        connection.query('SELECT count(*) as count from commandlog', [], function(err, result) {
            done();

            if(err) {
                return console.error('error running query', err);
            }
            console.log("Command log count: " + result.rows[0].count);
            //output: 1
        });
        connection.query('SELECT count(*) as count from eventlog', [], function(err, result) {
            done();

            if(err) {
                return console.error('error running query', err);
            }
            console.log("Event log count: " + result.rows[0].count);
            //output: 1
        });
    });

    pool.on('error', function (err, client) {
        // if an error is encountered by a connection while it sits idle in the pool
        // the pool itself will emit an error event with both the error and
        // the connection which emitted the original error
        // this is a rare occurrence but can happen if there is a network partition
        // between your application and the database, the database restarts, etc.
        // and so you might want to handle it and at least log it out
        console.error('idle client error', err.message, err.stack)
    });

    return {
        pool
    }
};
