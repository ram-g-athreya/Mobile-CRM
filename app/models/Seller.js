module.exports = function(options) {
    var Seller = options.db.define(options.table, {
        id_seller: Number,
        seller_name: String,
        address: String,
        email: String,
        phone: String
    }, {
        id: 'id_seller',
        methods: {
            getRating: function() {

            }
        }
    });

    Seller.setProductCount = function(cb) {
        options.db.models.tbl_product.aggregate(['id_seller']).count().groupBy('id_seller').order('id_seller').get(function(err, data) {
            if (err) {
                throw err;
            }
            var max = 0,
                min = Infinity,
                count, ratings = Array();
            for (var index in data) {
                count = parseInt(data[index].count);
                if (count > max) {
                    max = count;
                }

                if (count < min) {
                    min = count;
                }

                ratings[parseInt(index)] = count;
            }
            Seller.product_count = ratings;
            Seller.product_count_max = max;
            Seller.product_count_min = min;
            cb();
        });
    };

    Seller.assignSeller = function() {
        Seller.count(function(err, count) {
            count = parseInt(count);
            var sum = count * (count + 1) / 2;
            var p = [];
            for (var index = 0; index < count; index++) {
                p[index] = parseFloat(((index + 1) / sum));
                if (index > 0) {
                    p[index] += p[index - 1];
                }
            }

            function getSellerIndex() {
                var r = Math.random();
                for (var index in p) {
                    if (p[index] >= r) {
                        return (parseInt(index) + 1);
                    }
                }
            }

            var seller_index;
            //Change to each later so that it is easier to process
            options.db.models.tbl_product.find({}, function(err, products) {
                (function process(index) {
                    if (index < products.length) {
                        seller_index = getSellerIndex();
                        products[index].save({
                            id_seller: seller_index
                        }, function(err) {
                            if (err) {
                                throw err;
                            }
                            console.log(index + 1, seller_index);
                            process(++index);
                        });
                    }
                })(1);
            });
        });
    };

    Seller.generateSeller = function() {
        var item = {
            seller_name: getRandomString(),
            address: getRandomString(),
            email: getRandomString() + "@gmail.com",
            phone: (getRandomNumber(9 * Math.pow(10, 9), Math.pow(10, 10) - 1)).toString()
        };

        Seller.create(item, function(err, item) {
            if (err) {
                throw err;
            }
            console.log(item.id_seller);
        });
    };
};
