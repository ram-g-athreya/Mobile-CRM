forEach = function (data, fn, response){
  var index = -1;
  (function process(){
    ++index;
    if(index < data.length){
      fn(data[index], process);
    }
    else{
      response();
    }
  })();
}

getRandomItem = function(array){
  return array[Math.floor(Math.random() * array.length)];
}

getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

getComponent = function(name){
  return require(app.basepath + '/app/components/' + name)
}

doNTimes = function(options){
  var index = (options.start) ? options.start - 1: -1;
  (function process(){
    ++index;
    if(index < options.n){
      options.fn(index, process);
    }
    else{
      if(options.cb)
        options.cb();
    }
  })();
};

emptyFn = function(){

};
