var orm = require("orm");
var tbl_prefix = "tbl_";
module.exports = function(config, callback){
    orm.connect(config, function (err, db) {
      if (err) throw err;

      db.brand = require('./app/models/Brand')({db: db, table: tbl_prefix + 'brand'});
      db.model = require('./app/models/Model')({db: db, table: tbl_prefix + 'model'});

      app.db = db;
      callback();
    });
}
