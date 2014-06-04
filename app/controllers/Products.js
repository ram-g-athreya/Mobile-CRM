function productsIndex(options){
  app.db.driver.execQuery(app.db.models.tbl_product.generateFilterParams({id_brand_type: options.id_brand_type}), function(err, products){
    options.res.render(options.render, {data: products, id_brand_type: options.id_brand_type, user: options.req.user});
  });
};

function filterProducts(options){
  var sql = app.db.models.tbl_product.generateFilterParams({
    price: options.req.param('price'),
    id_brand: options.req.param('id_brand'),
    offer: options.req.param('offer'),
    warranty: options.req.param('warranty'),
    page: options.req.param('page'),
    id_brand_type: options.req.param('id_brand_type')
  });
  app.db.driver.execQuery(sql, function(err, products){
    options.res.render(options.render, {data: products, id_brand_type: options.id_brand_type});
  });
}


//Category wise URLs
exports.smartphonesIndex = function(req, res){
  productsIndex({
    id_brand_type: 1,
    res: res,
    render: 'site/products/smartphones',
    req: req
  });
};
exports.earphonesIndex = function(req, res){
  productsIndex({
    id_brand_type: 2,
    res: res,
    render: 'site/products/earphones',
    req: req
  });
};
exports.watchesIndex = function(req, res){
  productsIndex({
    id_brand_type: 3,
    res: res,
    render: 'site/products/watches',
    req: req
  });
};
exports.jeansIndex = function(req, res){
  productsIndex({
    id_brand_type: 4,
    res: res,
    render: 'site/products/jeans',
    req: req
  });
};
exports.tShirtsIndex = function(req, res){
  productsIndex({
    id_brand_type: 5,
    res: res,
    render: 'site/products/t-shirts',
    req: req
  });
};


exports.filterProducts = function(req, res){
  filterProducts({
    req: req,
    res: res,
    render: 'templates/products/listings'
  });
};

exports.productDetails = function(req, res){
  var id_product = req.params.id;
  app.db.models.tbl_product.find({id_product: id_product}, function(err, product){
    product = product[0];
    product.getProductDetails(function(details){
        var data = {
          product: product,
          details: details,
          user: req.user
        };
        res.render('site/products/details', data);
    });
  });
};

exports.sellProduct = function(req, res){
  var customer_info = req.param('customer_info');
  var id_product = req.param('id_product'), id_customer;

  var Customer = app.db.models.tbl_customer;
  var params = {
    email: customer_info.email,
    phone: customer_info.phone
  };
  Customer.exists(params, function(err, exists){
      if(err)throw err;
      if(!exists){
        Customer.create([customer_info], function(err, items){
          id_customer = items[0].id_customer;
          insertSoldRecord();
        });
      }
      else{
          Customer.find(params, function(err, customer){
            customer = customer[0];
            id_customer = customer.id_customer;
            insertSoldRecord();
          });
      }

      function insertSoldRecord(){
        app.db.models.tbl_sold.create([{
          id_product: id_product,
          id_customer: id_customer
        }], function(err, items){
          app.db.models.tbl_product.find({id_product: id_product}, function(err, product){
            product = product[0];
            product.is_sold = 1;
            product.save(function(err){
              if(err)throw err;
              res.end();
            });
          });
        });
      }
  });
};
