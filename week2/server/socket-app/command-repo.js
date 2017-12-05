module.exports=function(injected){

    const dbPool = injected('dbPool');
    const commandRouter = injected('commandRouter');

    let repo = {

        storeCommand:function(cmdObj, errCb, successCb){

            if(!cmdObj.commandId){
                // Transient event
                successCb();
                return;
            }


            dbPool.connect(function(err, connection, done) {
                if(err) {
                    return console.error('error fetching db connection from pool', err);
                }

                let statement = 'INSERT INTO commandlog (id, timestamp, json) VALUES ($1,$2,$3)';
                let statementParams = [cmdObj.commandId, new Date(), JSON.stringify(cmdObj)];

                connection.query(statement,statementParams, function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        errCb('error executing statement ' + err + ", params:" + statementParams);
                    } else {
                        successCb();
                    }
                });
            });

        }
    };

    commandRouter.on('*', function(commandObj){
        repo.storeCommand(commandObj, function(err){
            console.error('Error storing command object: ' + err)
        }, function(){
            // Success...do nothing
        })
    });

    return repo


};