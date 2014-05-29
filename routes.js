var site = require("./app/controllers/Site");
var products = require("./app/controllers/Products");
var admin = require("./app/controllers/Admin");

module.exports = function() {
    //Product URLs
    app.get('/', products.smartphonesIndex);
    app.get('/product/:id', products.productDetails);
    app.post('/product/filter-products', products.filterProducts);
    app.post('/sell-product', products.sellProduct);

    // Product Category wise URLs
    app.get('/smartphones', products.smartphonesIndex);
    app.get('/earphones', products.earphonesIndex);
    app.get('/watches', products.watchesIndex);
    app.get('/jeans', products.jeansIndex);
    app.get('/t-shirts', products.tShirtsIndex);

    app.get('/', products.smartphonesIndex);

    //Authentication URLs
    app.get('/login', site.login);

    app.post('/dologin',
        passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
    }));

    //Admin URLs
    app.get('/admin', admin.index);
    app.get('/admin/sell', admin.sell);
};
