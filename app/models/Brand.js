module.exports = function(options){
  var Brand = options.db.define(options.table, {
    id_brand: Number,
    brand_name: String
  },{
    id: 'id_brand',
    methods: {
      getAllModels: function(callback){
        options.db.models.model.find({id_brand: this.id_brand}, function(err, data){
            if(err)throw err;
            callback(data);
        });
      }
    }
  });
};
