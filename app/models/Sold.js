module.exports = function(options){
  var Sold = options.db.define(options.table, {
    id_sold: Number,
    id_customer: Number,
    id_product: Number
  },{
    id: 'id_sold',
    methods: {

    }
  });

  Sold['assignSold'] = function(){
    function getIndex(p){
      var r = Math.random();
      for(var index in p){
        if(p[index] >= r){
          return (parseInt(index) + 1);
        }
      }
    }

    function generateP(count){
      count = parseInt(count);
      var sum = count * (count + 1) / 2;
      var p = [];
      for(var index = 0;index < count;index++){
        p[index] = parseFloat(((index + 1) / sum).toFixed(2));
        if(index > 0){
          p[index] += p[index - 1];
        }
      }
      return p;
    }

      options.db.models.tbl_customer.count(function(err, customer_count){
        var customer_p = generateP(customer_count);

        options.db.models.tbl_product.find({}).each(function(product, index){
          product.getModel(function(err, model){
            var weightage = (product.final_price - model.price) / model.price;
            //-46% to 20%
            if(product.warranty){
              weightage -= 0.1;
            }
            weightage = parseInt(weightage * 100);
            weightage = transformRange([[-46, 20], [0, 1]], weightage);

            if(Math.random() >= weightage){
              var sold_item = {
                id_customer: getIndex(customer_p),
                id_product: product.id_product
              };
              product.save({is_sold: 1});
              options.db.models.tbl_sold.create(sold_item, emptyFn);
              console.log('PRODUCT ' + product.id_product + ' HAS BEEN MARKED AS SOLD');
            }
          });
        })
      });
  }
};
