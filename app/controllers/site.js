exports.productsIndex = function(req, res){
  app.db.models.tbl_product.find({}, {limit: 100}, function(err, products){
    var result = Array();
    var index = 0;
    forEach(products, function(product, cb){
      product.getProductDetails(function(details){
        result[index++]={
          product: product,
          details: details
        };
        cb();
      });
    }, function(){
        res.render('site/products/index', {data: result});
    });
  });
};

exports.productDetails = function(req, res){
  res.render('site/products/details');
};
