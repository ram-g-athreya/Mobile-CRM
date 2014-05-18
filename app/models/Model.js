module.exports = function(options){
  var model = options.db.define(options.table, {
    id_model: Number,
    id_brand: Number,
    model_name: String
  }, {
    id: 'id_model'
  },{
    methods: {
      Brand: function(){

      }
    }
  });

  return model;
};
