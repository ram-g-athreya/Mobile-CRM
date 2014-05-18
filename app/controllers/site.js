
exports.index = function(req, res){
  app.db.model.find(function(err, data){
    if(err)throw err;
    for(var index in data){
      res.write(data[index].model_name + '\n');
    }
    res.end();
  });
};
