module.exports = function(options){
  var offer_range = [0, 5, 10, 15, 20];
  var min = -20;
  var max = 20;

  var Product = options.db.define(options.table, {
    id_product: Number,
    id_model: Number,
    offer: Number,
    warranty: Number,
    price: Number
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
        var me = this;
        this.getModel(function(err, model){
          model.getBrand(function(err, brand){
            cb({name: [brand.brand_name, model.model_name].join(' '), price: me.price});
          });
        });
      }
    }
  });

  Product['updateProduct'] = function(id_product, cb){
    Product.find({id_product: id_product}, function(err, product){
      product = product[0];
      var offer = (Math.random()>=0.9)?getRandomItem(offer_range):0;
      var warranty = Math.random() >= 0.7;
      product.getModel(function(err, model){
        var selling_price = model.price - model.price * getRandomNumber(min, max) / 100;

        product.price = selling_price;
        product.offer = offer;
        product.warranty = warranty;
        product.save(function(err){
          if(cb)
            cb();
        });
      });
    });
  };

  Product['generateProduct'] = function(){
    options.db.models.tbl_model.count(function(err, count){
      var id_model = getRandomNumber(1, count);
      var warranty = Math.random() >= 0.7;
      var offer = getRandomItem(offer_range);

      options.db.models.tbl_model.find({id_model: id_model}, function(err, model){
        model = model[0];
        var selling_price = model.price - model.price * getRandomNumber(min, max) / 100;

        Product.create([{
          id_model: id_model,
          warranty: warranty,
          offer: offer,
          price: selling_price
        }], function(){});
      });
    });
  };

  Product.hasOne('model', options.db.models.tbl_model,  {reverse: 'products'});
};