module.exports = function(options){
  var model = options.db.define(options.table, {
    id_brand: Number,
    brand_name: String
  }, {
    id: 'id_brand'
  });

  return model;
};
