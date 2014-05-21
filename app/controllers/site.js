function generateFilterParams(params){
  var sql = "select id_model, id_product, tbl_product.price, offer, is_sold, brand_name, model_name from tbl_product " +
  "inner join tbl_model using(id_model) " +
  "inner join tbl_brand using(id_brand) " +
  "where is_sold = 0 ";
  params.offer = parseInt(params.offer);
  params.warranty = parseInt(params.warranty);

  var page_size = 8;
  var offset = (params.page) ? " offset " + (params.page - 1) * page_size : "";

  if(params.price){
    var price = params.price, _price;
    sql += "and (";
    for(var index in price){
      if(index > 0)
        sql +=" or ";
      _price = price[index].split('|');
      sql += "(tbl_product.price>=" + _price[0] + " and tbl_product.price<=" + _price[1] + ")";
    }
    sql += ")";
  }

  if(params.id_brand){
    var brands = params.id_brand;
    sql += "and (";
    for(var index in brands){
      if(index > 0)
        sql +=" or ";
      sql += "tbl_brand.id_brand = " + brands[index];
    }
    sql += ")";
  }

  if(params.offer){
      sql += " and offer > 0";
  }

  if(params.warranty){
      sql += " and warranty = " + parseInt(params.warranty);
  }

  return sql + " order by id_product asc limit " + page_size + offset;
}

exports.filterProducts = function(req, res){
  var sql = generateFilterParams({
    price: req.param('price'),
    id_brand: req.param('id_brand'),
    offer: req.param('offer'),
    warranty: req.param('warranty'),
    page: req.param('page')
  });
  app.db.driver.execQuery(sql, function(err, products){
    res.render('templates/products/listings', {data: products});
  });
}

exports.productsIndex = function(req, res){
  app.db.driver.execQuery(generateFilterParams({}), function(err, products){
    res.render('site/products/index', {data: products});
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
  if(req.user){
    res.redirect('/admin');
  }
  else{
    res.render('site/login');
  }
};
