module.exports = function(options) {
    var Sold = options.db.define(options.table, {
        id_sold: Number,
        id_customer: Number,
        id_product: Number
    }, {
        id: 'id_sold',
        methods: {}
    });

    var warranty_weightage = 0.1;
    var affinity_weightage = 0.1;
    var trusted_seller_weightage = 0.1;

    Sold.assignSold = function(opts) {
        options.db.models.tbl_product.get(opts.index, function(err, product) {
            product.getModel(function(err, model) {
                var weightage = (product.final_price - model.price) / model.price;

                //-46% to 20%
                if (product.warranty) {
                    weightage -= warranty_weightage; //0.1
                }
                //var random_customer = getIndex(customer_p);

                var random_customer = opts.random_customer;

                //Computing buyer affinity
                product.getBrandType(function(id_brand_type) {
                    options.db.models.tbl_customer.get(random_customer, function(err, customer) {
                        customer.getAffinity({
                            id_brand_type: id_brand_type,
                            cb: function(customer_opts) {
                                //-56% to 30%
                                if (customer_opts.already_bought) {
                                    weightage += affinity_weightage;
                                    console.log('ALREADY BOUGHT WEIGHTAGE IN PLAY');
                                }
                                if (customer_opts.related_bought) {
                                    weightage -= affinity_weightage;
                                    console.log('RELATED BOUGHT WEIGHTAGE IN PLAY');
                                }

                                //Computing seller rating
                                var seller = options.db.models.tbl_seller;
                                var count = seller.product_count[parseInt(product.id_seller)];
                                var rating = transformRange([
                                    [seller.product_count_min, seller.product_count_max],
                                    [0, 1]
                                ], count);

                                //-66% to 30%
                                weightage -= rating * trusted_seller_weightage;
                                //console.log("overall weightage is " + weightage);

                                weightage = parseInt(weightage * 100);
                                weightage = 1 - transformRange([
                                    [-66, 30],
                                    [0, 1]
                                ], weightage);

                                //console.log('FINAL WEIGHTAGE IS ' + weightage, weightage >= Math.random());
                                if (weightage >= Math.random()) {
                                    var sold_item = {
                                        id_customer: random_customer,
                                        id_product: product.id_product
                                    };
                                    product.save({
                                        is_sold: 1
                                    });
                                    options.db.models.tbl_sold.create(sold_item, function() {
                                        console.log(product.id_product, "SOLD");
                                        if (opts.cb) {
                                            opts.cb(++opts.index);
                                        }
                                    });
                                } else {
                                    console.log(product.id_product, "NOT SOLD");
                                    if (opts.cb) {
                                        opts.cb(++opts.index);
                                    }
                                }
                            }
                        });
                    });
                });
            });
        });
    };
};
