exports.productsIndex = function(req, res){
  app.db.models.tbl_product.find({is_sold: 0}, {limit: 100}, function(err, products){
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
  var id_product = req.params.id;
  app.db.models.tbl_product.find({id_product: id_product}, function(err, product){
    product = product[0];
    product.getProductDetails(function(details){
        var data = {
          product: product,
          details: details
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


exports.login = function(req, res){
  res.render('site/login');
};

exports.dologin = function(req, res){
  var params = {
    username: req.param('username'),
    password: req.param('password')
  };
  app.db.models.tbl_user.exists(params, function(err, exists){
    if(err)throw err;
    if(exists){
      res.redirect('admin');
    }
    else{
      res.redirect('login');
    }
  });
};
