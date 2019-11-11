function _extends() {
  module.exports = _extends =  function (target) {
    console.log( target)
    for (var i = 1; i < arguments.length; i++) {
      console.log(i)
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  console.log("this:"+this)
  return _extends.apply(this, arguments);
}

module.exports = _extends;


var s=_extends({name:"lzj"},{age:123})
console.log(s === void 0)



 