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


// doNTimes({
//   n: 9,
//   start: 1,
//   fn: function(index, cb){
//     REPEAT_FUNCTION_TO_EXECUTE(index, cb);
//   },
//   cb: CALLBACK FUNCTION TO EXECUTE ON COMPLETION
// });
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
}
