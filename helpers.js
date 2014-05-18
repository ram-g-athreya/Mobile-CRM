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
