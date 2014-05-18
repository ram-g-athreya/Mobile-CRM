var site = require("./app/controllers/site");

module.exports = function() {
    //Site URLs
    app.get('/', site.index);
};
