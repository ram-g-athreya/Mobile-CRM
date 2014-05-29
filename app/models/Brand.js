module.exports = function(options){
  var Brand = options.db.define(options.table, {
    id_brand: Number,
    brand_name: String,
    id_brand_type: Number
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
  Brand['affinities'] = [
  [1, 2],
  [3],
  [4, 5]
  ];
};
