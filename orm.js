var orm = require("orm");

module.exports = function(config, callback){
    orm.connect(config, function (err, db) {
      if (err) throw err;
      db.settings.set("properties.association_key", "{field}");

      require('./app/models/Brand')({orm: orm, db: db, table: 'tbl_brand'});
      require('./app/models/Customer')({orm: orm, db: db, table: 'tbl_customer'});
      require('./app/models/Model')({orm: orm, db: db, table: 'tbl_model'});
      require('./app/models/Product')({orm: orm, db: db, table: 'tbl_product'});
      require('./app/models/Sold')({orm: orm, db: db, table: 'tbl_sold'});
      require('./app/models/User')({orm: orm, db: db, table: 'tbl_user'});

      app.db = db;
      callback();
    });
}
