module.exports = function(options){
  var Seller = options.db.define(options.table, {
    id_seller: Number,
    seller_name: String,
    address: String,
    email: String,
    phone: String
  },{
    id: 'id_seller',
    methods: {

    }
  });

  Seller['assignSeller'] = function(){
    Seller.count(function(err, count){
      count = parseInt(count);
      var sum = count * (count + 1) / 2;
      var p = [];
      for(var index = 0;index < count;index++){
        p[index] = parseFloat(((index + 1) / sum).toFixed(2));
        if(index > 0){
          p[index] += p[index - 1];
        }
      }

      function getSellerIndex(){
        var r = Math.random();
        for(var index in p){
          if(p[index] >= r){
            return (parseInt(index) + 1);
          }
        }
      }

      options.db.models.tbl_product.find({}, function(err, products){
        for(var index in products){
          products[index].save({id_seller: getSellerIndex()});
        }
      });
    });
  };

  Seller['generateSeller'] = function(){
    var item = {
        seller_name: getRandomString(),
        address: getRandomString(),
        email: getRandomString() + "@gmail.com",
        phone: (getRandomNumber(9 * Math.pow(10, 9), Math.pow(10, 10) - 1)).toString()
      };

    Seller.create(item, function(err){
        if(err)throw err;
      });
  };
};
