var site = require("./app/controllers/site");
var admin = require("./app/controllers/admin");

module.exports = function() {
    //Site URLs
    app.get('/', site.productsIndex);
    app.get('/product/:id', site.productDetails);
    app.post('/sell-product', site.sellProduct);

    app.get('/login', site.login);
    app.post('/dologin', site.dologin);

    app.get('/admin', admin.index);
    app.get('/admin/sell', admin.sell);
};
