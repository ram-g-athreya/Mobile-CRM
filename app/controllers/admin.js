exports.index = function(req, res){
  app.db.models.tbl_product.count(function(err, product_count){
    app.db.models.tbl_sold.count(function(err, sold_count){
      app.db.models.tbl_customer.count(function(err, customer_count){
        app.db.models.tbl_brand.count(function(err, brand_count){
          res.render('admin/index', {
            product_count: product_count,
            sold_count: sold_count,
            customer_count: customer_count,
            brand_count: brand_count
          });
        });
      });
    });
  });
};

exports.sell = function(req, res){
  var id_product = 1;
  app.db.driver.execQuery("call getRandomProduct();", function(err, data){
    if(err) throw err;
    data = data[0][0];
    app.db.models.tbl_product.find({id_product: data.id_product}, function(err, product){
      if(err)throw err;
      product = product[0];
      product.getProductDetails(function(details){
          data = {
            product: product,
            details: details
          };
          res.render('admin/sell', data);
      });
    });
  });
};
