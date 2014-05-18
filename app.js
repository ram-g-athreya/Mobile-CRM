var config = require('./config');

var express = require('express');
var http = require('http');
var path = require('path');

app = express();


//app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

require('./routes')();
require('./orm')(config.db, function(){
  http.createServer(app).listen(3000, function() {
    console.log('Express server listening on port 3000');
  });
});
