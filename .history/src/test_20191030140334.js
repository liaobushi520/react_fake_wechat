// function _extends() {
//   module.exports = _extends =  function (target) {
//     console.log( target)
//     for (var i = 1; i < arguments.length; i++) {
//       console.log(i)
//       var source = arguments[i];
//       for (var key in source) {
//         if (Object.prototype.hasOwnProperty.call(source, key)) {
//           target[key] = source[key];
//         }
//       }
//     }

//     return target;
//   };
//   console.log("this:"+this)
//   return _extends.apply(this, arguments);
// }

// module.exports = _extends;


// var s=_extends({name:"lzj"},{age:123})

// ///void 0 就是undefined
// console.log(undefined === void 0)
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;


function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;

console.log(_objectWithoutProperties( {name:"lzj",age:1111},["name", ]))













 