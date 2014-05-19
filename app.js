require('./helpers');
require('./authenticate');

var config = require('./config');
var express = require('express');
var http = require('http');
var path = require('path');

app = express();
app.configure(function() {
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({secret: 'keyboard cat'}));
    app.use(passport.initialize());
    app.use(passport.session());

    app.locals.basedir = path.join(__dirname, '/app/views');
    app.use(app.router);

    require('./routes')();

    require('./orm')(config.db, function(){
      http.createServer(app).listen(3000, function() {
        console.log('Express server listening on port 3000');
        // for(var index = 0;index<10;index++)
        //   app.db.models.tbl_product.generateProduct();
        // for(var index = 1;index<=3000;index++){
        //   app.db.models.tbl_product.updateProduct(index);
        // }
      });
    });
});
