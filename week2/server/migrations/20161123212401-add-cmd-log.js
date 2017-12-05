'use strict';

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db,callback) {
  db.createTable('commandlog', {
    timestamp:{ type:'datetime'},
    id: { type: 'string', primaryKey: true },
    json: 'string'
  }, callback);};

exports.down = function(db) {
  db.dropTable('commandlog', callback);
};

exports._meta = {
  "version": 1
};
