module.exports = function(options) {
    var offer_range = [5, 10, 15, 20];
    var min = -20;
    var max = 20;

    var Product = options.db.define(options.table, {
        id_product: Number,
        id_model: Number,
        id_seller: Number,
        offer: Number,
        warranty: Number,
        price: Number,
        final_price: Number,
        is_sold: Number
    }, {
        id: 'id_product',
        methods: {
            getProductName: function(cb) {
                this.getModel(function(err, model) {
                    model.getBrand(function(err, brand) {
                        cb([brand.brand_name, model.model_name].join(' '));
                    });
                });
            },
            getProductDetails: function(cb) {
                var me = this;
                this.getModel(function(err, model) {
                    model.getBrand(function(err, brand) {
                        cb({
                            name: [brand.brand_name, model.model_name].join(' '),
                            price: me.price
                        });
                    });
                });
            },
            getBrandType: function(cb) {
                this.getModel(function(err, model) {
                    model.getBrand(function(err, brand) {
                        cb(brand.id_brand_type);
                    });
                });
            }
        }
    });

    Product.updateProduct = function(id_product, cb) {
        Product.find({
            id_product: id_product
        }, function(err, product) {
            product = product[0];
            var offer = (Math.random() >= 0.9) ? getRandomItem(offer_range) : 0;
            var warranty = Math.random() >= 0.3;
            product.getModel(function(err, model) {
                var selling_price = parseInt(model.price - model.price * getRandomNumber(min, max) / 100);
                var final_price = parseInt((1 - offer / 100) * selling_price);

                product.price = selling_price;
                product.offer = offer;
                product.warranty = warranty;
                product.final_price = final_price;
                product.save(function() {
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    };

    Product.generateProduct = function(opts) {
        function process(min, max) {
            var id_model = getRandomNumber(min, max);
            var warranty = Math.random() >= 0.7;
            var offer = (Math.random() >= 0.9) ? getRandomItem(offer_range) : 0;
            options.db.models.tbl_model.find({
                id_model: id_model
            }, function(err, model) {
                if (err) {
                    throw err;
                }
                model = model[0];
                var selling_price = parseInt(model.price - model.price * getRandomNumber(min, max) / 100);
                var final_price = parseInt((1 - offer / 100) * selling_price);
                Product.create({
                    id_model: id_model,
                    warranty: warranty,
                    offer: offer,
                    price: selling_price,
                    final_price: final_price,
                    is_sold: 0
                }, function(err) {
                    if (err) {
                        throw err;
                    }
                    if (opts && opts.cb) {
                        opts.cb(opts.index + 1);
                    }
                });
            });
        }

        if (opts && opts.min && opts.max) {
            process(opts.min, opts.max);
        } else {
            options.db.models.tbl_model.count(function(err, count) {
                if (err) {
                    throw err;
                }
                count = parseInt(count);
                process(1, count);
            });
        }
    };

    //Generate sql query based on parameters selected by user for filtering the results
    Product.generateFilterParams = function(params) {
        var sql = "select id_model, id_product, tbl_product.price, final_price, offer, is_sold, brand_name, model_name from tbl_product " +
            "inner join tbl_model using(id_model) " +
            "inner join tbl_brand using(id_brand) " +
            "where is_sold = 0 and id_brand_type=" + params.id_brand_type + " ";
        params.offer = parseInt(params.offer);
        params.warranty = parseInt(params.warranty);

        var page_size = 8;
        var offset = (params.page) ? " offset " + (params.page - 1) * page_size : "";

        if (params.price) {
            var price = params.price,
                _price;
            sql += "and (";
            for (var index in price) {
                if (index > 0) {
                    sql += " or ";
                }
                _price = price[index].split('|');
                sql += "(tbl_product.price>=" + _price[0] + " and tbl_product.price<=" + _price[1] + ")";
            }
            sql += ")";
        }

        if (params.id_brand) {
            var brands = params.id_brand;
            sql += "and (";
            for (var _index in brands) {
                if (_index > 0) {
                    sql += " or ";
                }
                sql += "tbl_brand.id_brand = " + brands[_index];
            }
            sql += ")";
        }

        if (params.offer) {
            sql += " and offer > 0";
        }

        if (params.warranty) {
            sql += " and warranty = " + parseInt(params.warranty);
        }
        return sql + " order by id_product asc limit " + page_size + offset;
    };

    Product.hasOne('model', options.db.models.tbl_model, {
        reverse: 'products'
    });
    Product.hasOne('seller', options.db.models.tbl_seller, {
        reverse: 'products'
    });

    return Product;
};
