var mongodb = require('mongodb');
var mongo_client = mongodb.MongoClient;

module.exports = {
  mongodb: mongodb,
  get_db: function(callback) {
    mongo_client.connect(process.env.NODE_ENV != 'production' ? 'mongodb://localhost/overmatch' : 'mongodb://172.31.12.84/overmatch', function(err, db) {
      callback(db);
    });
  }
}
