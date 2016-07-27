var orm = require("orm");

var Orm = function(config, callback) {
    orm.connect(config, function (err, db) {
      if (err) throw err;
      db.settings.set("properties.association_key", "{field}");
      Orm.createModels(orm, db);

      if(typeof app != 'undefined') {
        app.db = db;
        app.orm = orm;
      }

      callback({db: db, orm: orm});
    });
}

Orm.createModels = function(orm, db) {
  require('./app/models/Brand')({orm: orm, db: db, table: 'tbl_brand'});
  require('./app/models/BrandType')({orm: orm, db: db, table: 'tbl_brand_type'});
  require('./app/models/Customer')({orm: orm, db: db, table: 'tbl_customer'});
  require('./app/models/Model')({orm: orm, db: db, table: 'tbl_model'});
  require('./app/models/Product')({orm: orm, db: db, table: 'tbl_product'});
  require('./app/models/Seller')({orm: orm, db: db, table: 'tbl_seller'});
  require('./app/models/Sold')({orm: orm, db: db, table: 'tbl_sold'});
  require('./app/models/SoldRules')({orm: orm, db: db, table: 'tbl_sold_rules'});
  require('./app/models/User')({orm: orm, db: db, table: 'tbl_user'});
}

module.exports = Orm;
