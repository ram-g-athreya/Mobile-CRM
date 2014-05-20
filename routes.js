var site = require("./app/controllers/site");

module.exports = function() {
    //Site URLs
    app.get('/', site.productsIndex);
    app.get('/product/:id', site.productDetails);
    app.post('/sell-product', site.sellProduct);
};
