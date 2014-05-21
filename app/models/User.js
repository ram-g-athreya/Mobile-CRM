module.exports = function(options){
  var User = options.db.define(options.table, {
    id_user: Number,
    username: String,
    password: String
  },{
    id: 'id_user',
    methods: {
      
    }
  });
};
