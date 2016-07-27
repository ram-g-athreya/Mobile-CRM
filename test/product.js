var expect = require('chai').expect;
var config = require('../config').db;
var orm = require("../orm"),
    db;
var ProductModel;

describe("Product Page", function() {
    before(function(done) {
        orm(config, function(opts) {
            db = opts.db;
            ProductModel = db.models.tbl_product;
            done();
        });
    });

    describe("Check Product Model", function() {
        var product_details, product;
        it("Find Product Details", function(done) {
            ProductModel.find({
                id_product: 1038
            }, function(err, results) {
                expect(err).to.equal(null);
                results[0].getProductDetails(function(data) {
                    product = results[0];
                    product_details = data;
                    done();
                });
            });
        });

        it("Check Product Name", function(done) {
            expect(product_details.name).to.equal("HTC Desire 210");
            done();
        });

        it("Check Product Price", function(done) {
            expect(product.price).to.equal(6689);
            done();
        });

        it("Check Warranty", function(done) {
            expect(product.warranty).to.equal(1);
            done();
        });

        it("Check Offer", function(done) {
            expect(product.offer).to.equal(5);
            done();
        });

        it("Check Final Price", function(done) {
            var computed_final_price = Math.floor(product.price - product.price * product.offer / 100);
            expect(computed_final_price).to.equal(product.final_price);
            done();
        });

    });
});
