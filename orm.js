var orm = require("orm");

module.exports = function(config, callback){
    orm.connect(config, function (err, db) {
      if (err) throw err;

      db.brand = require('./app/models/Brand')({db: db, table: 'tbl_brand'});
      app.db = db;
      callback();
    });
}
