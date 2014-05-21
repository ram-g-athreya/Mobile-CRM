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

        app.db.models.tbl_product.find({
          //price:
          //or: [{price: app.orm.between(5000, 10000)}, {price: app.orm.between(10000, 20000)}]
        }, {limit: 5},
        function(err, data){
          if(err)throw err;
          for(var index in data){
            //console.log(data[index].price);
          }
        });
      });
    });
});
