module.exports = function(options) {
    var Customer = options.db.define(options.table, {
        id_customer: Number,
        customer_name: String,
        address: String,
        email: String,
        phone: String
    }, {
        id: 'id_customer',
        methods: {
            getAffinity: function(opts) {
                var affinities = options.db.models.tbl_brand.affinities;
                var association_array;
                var already_bought = false, related_bought = false;

                for (var index in affinities) {
                    if (affinities[index].indexOf(opts.id_brand_type) >= 0) {
                        association_array = affinities[index];
                        break;
                    }
                }

                this.getSold(function(err, purchases) {
                    if (err)
                        throw err;

                    if (purchases) {
                        (function process(index) {
                            if (index < purchases.length) {
                                options.db.models.tbl_product.find({id_product: purchases[index].id_product}, function(err, product) {
                                    product = product[0];
                                    product.getBrandType(function(id_brand_type) {
                                        if (id_brand_type == opts.id_brand_type) {
                                            already_bought = true;
                                        }
                                        else if (association_array.indexOf(id_brand_type) >= 0) {
                                            related_bought = true;
                                        }
                                        process(++index);
                                    });
                                });
                            }
                            else {
                                opts.cb({
                                    already_bought: already_bought,
                                    related_bought: related_bought
                                });
                            }
                        })(0);
                    }
                    else {
                        opts.cb({
                            already_bought: already_bought,
                            related_bought: related_bought
                        });
                    }
                });
            }
        },
        validations: {
            customer_name: options.orm.enforce.ranges.length(3, 45, "Invalid Name"),
            address: options.orm.enforce.ranges.length(3, undefined, "Invalid Address"),
            phone: options.orm.enforce.ranges.length(10, 10, "Invalid Phone Number"),
            email: options.orm.enforce.patterns.email("Invalid E-Mail")
        }
    });
    Customer['generateCustomer'] = function() {
        var item = {
            customer_name: getRandomString(),
            address: getRandomString(),
            email: getRandomString() + "@gmail.com",
            phone: (getRandomNumber(9 * Math.pow(10, 9), Math.pow(10, 10) - 1)).toString()
        };
        Customer.create(item, function(err, item) {
            if (err)
                throw err;
            console.log(item.id_customer);
        });
    };

    Customer.hasMany('sold', {id_sold: Number, id_product: Number}, {reverse: 'customer', mergeTable: 'tbl_sold'});
};
