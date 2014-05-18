module.exports = function(options){
  var Product = options.db.define(options.table, {
    id_product: Number,
    id_model: Number
  },{
    id: 'id_product',
    methods: {
      getProductName: function(cb){
        this.getModel(function(err, model){
          model.getBrand(function(err, brand){
            cb([brand.brand_name, model.model_name].join(' '));
          });
        });
      },
      getProductDetails: function(cb){
        this.getModel(function(err, model){
          model.getBrand(function(err, brand){
            cb({name: [brand.brand_name, model.model_name].join(' '), price: model.price});
          });
        });
      }
    }
  });
  Product.hasOne('model', options.db.models.tbl_model,  {reverse: 'products'});
};
