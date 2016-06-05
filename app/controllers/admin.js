;
exports.index = function(req, res) {
    if (req.user) {
        app.db.models.tbl_product.count({is_sold: 0}, function(err, product_count) {
            app.db.models.tbl_sold.count(function(err, sold_count) {
                app.db.models.tbl_customer.count(function(err, customer_count) {
                    app.db.models.tbl_seller.count(function(err, seller_count) {
                        res.render('admin/index', {
                            product_count: product_count,
                            sold_count: sold_count,
                            customer_count: customer_count,
                            seller_count: seller_count,
                            user: req.user
                        });
                    });
                });
            });
        });
    }
    else {
        res.redirect('/login');
    }
};

exports.sell = function(req, res) {
    if (req.user) {
        app.db.driver.execQuery("call getRandomProduct();", function(err, data) {
            if (err)
                throw err;
            data = data[0][0];
            app.db.models.tbl_product.find({id_product: data.id_product}, function(err, product) {
                if (err)
                    throw err;
                product = product[0];
                product.getProductDetails(function(details) {
                    data = {
                        product: product,
                        details: details,
                        user: req.user
                    };
                    res.render('admin/sell', data);
                });
            });
        });
    }
    else {
        res.redirect('/login');
    }
};

exports.recommend = function(req, res) {
    if (req.user) {
        var page = req.param('page');
        var results = Array(), limit = 100;
        app.db.driver.execQuery('select distinct id_customer from tbl_sold limit ' + limit + ' offset ' + ((page) ? page * limit : 0), function(err, customer) {
            if (err)
                throw err;
            app.db.models.tbl_brand_type.find({}, function(err, brand_types) {
                (function process(index) {
                    if (index < limit) {
                        app.db.driver.execQuery("call getCustomerPurchases(" + customer[index].id_customer + ");", function(err, data) {
                            if (err)
                                throw err;
                            data = data[0][0];
                            //Purchases already made
                            if (data.brands) {
                                app.db.models.tbl_sold_rules.find(['rhs'], {lhs: data.brands}, {limit: 1}, ["support", "Z"], function(err, rules) {
                                    if (err)
                                        throw err;
                                    rules = rules[0];
                                    results[index] = "Customer " + customer[index].id_customer
                                            + " has already bought " + data.brand_types
                                            + ". So he will be recommended a/an " + brand_types[rules.rhs - 1].brand_type;
                                    process(++index);
                                });
                            }
                            //No Purchases made then most bought product is recommended
                            else {
                                app.db.models.tbl_sold_rules.find(['rhs'], {}, {limit: 1}, ["support", "Z"], function(err, rules) {
                                    if (err)
                                        throw err;
                                    rules = rules[0];
                                    results[index] = "Customer " + customer[index].id_customer
                                            + " has not bought anything"
                                            + ". So he will be recommended the most bought product which is " + brand_types[rules.rhs - 1].brand_type;
                                    process(++index);
                                });
                            }
                        });
                    }
                    else {
                        if (page) {
                            res.render('templates/admin/recommend', {data: results});
                        }
                        else {
                            res.render('admin/recommend', {data: results, user: req.user});
                        }
                    }
                })(0);
            });
        });
    }
    else {
        res.redirect('/login');
    }
};
