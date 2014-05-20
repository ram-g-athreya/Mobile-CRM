module.exports = function(options){
  var Brand = options.db.define(options.table, {
    id_sold: Number,
    id_customer: Number,
    id_product: Number
  },{
    id: 'id_sold',
    methods: {

    }
  });
};
