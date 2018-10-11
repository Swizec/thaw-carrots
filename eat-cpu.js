// Borrowed from https://gist.github.com/sqren/5083d73f184acae0c5b7

function mySlowFunction(baseNumber) {
    var result = 0;
    for (var i = Math.pow(baseNumber, 10); i >= 0; i--) {
        result += Math.atan(i) * Math.tan(i);
    };
    return result;
}

// module.exports = mySlowFunction;
mySlowFunction(8);