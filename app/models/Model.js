module.exports = function(options){
  var Model = options.db.define(options.table, {
    id_model: Number,
    id_brand: Number,
    model_name: String,
    price: Number
  }, {
    id: 'id_model',
    methods: {

    },
    hasOne: {

    }
  });
  Model.hasOne('brand', options.db.models.tbl_brand,  {reverse: 'models'});
};
