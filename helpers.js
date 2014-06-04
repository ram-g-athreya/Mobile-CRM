var exec = require('child_process').exec;

execute = function(command, callback) {
    exec(command, function(error, stdout, stderr) {
        if (error)
            throw error;
        callback(stdout);
    });
};

forEach = function(data, fn, response) {
    var index = -1;
    (function process() {
        ++index;
        if (index < data.length) {
            fn(data[index], process);
        }
        else {
            response();
        }
    })();
};

getRandomItem = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

getComponent = function(name) {
    return require(app.basepath + '/app/components/' + name)
};

doNTimes = function(options) {
    var index = (options.start) ? options.start - 1 : -1;
    (function process() {
        ++index;
        if (index < options.n) {
            options.fn(index, process);
        }
        else {
            if (options.cb)
                options.cb();
        }
    })();
};

getRandomString = function() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '');
};

transformRange = function(ranges, x) {
    var a0 = ranges[0][0];
    var a1 = ranges[0][1];
    var b0 = ranges[1][0];
    var b1 = ranges[1][1];

    return ((x - a0) / (a1 - a0)) * (b1 - b0) + b0;
};

emptyFn = function() {

};
