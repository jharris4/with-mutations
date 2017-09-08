"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = getWithMutations;
function getWithMutations(oldValue, newValue, customMutator) {
  if (oldValue === null || oldValue === undefined || newValue === undefined || newValue === null || oldValue === newValue) {
    return newValue;
  } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    var newLength = newValue.length;
    var newArray = [];
    var different = false;
    var result = void 0;
    for (var i = 0; i < newLength; i++) {
      result = getWithMutations(oldValue[i], newValue[i], customMutator);
      newArray.push(result);
      if (result !== oldValue[i]) {
        different = true;
      }
    }
    if (oldValue.length === newValue.length && !different) {
      return oldValue;
    } else {
      return newArray;
    }
  } else if ((typeof oldValue === "undefined" ? "undefined" : _typeof(oldValue)) === "object" && (typeof newValue === "undefined" ? "undefined" : _typeof(newValue)) === "object") {
    var oldKeys = Object.keys(oldValue);
    var newKeys = Object.keys(newValue);
    var newKeyLength = newKeys.length;
    var oldKeyMap = oldKeys.reduce(function (map, key) {
      map[key] = true;return map;
    }, {});
    var newObject = {};
    var _different = false;
    var newKey = void 0;
    var _result = void 0;
    for (var _i = 0; _i < newKeyLength; _i++) {
      newKey = newKeys[_i];
      if (oldKeyMap[newKey]) {
        _result = getWithMutations(oldValue[newKey], newValue[newKey], customMutator);
        newObject[newKey] = _result;
        if (_result !== oldValue[newKey]) {
          _different = true;
        }
      } else {
        _different = true;
        newObject[newKey] = newValue[newKey];
      }
    }
    if (oldKeys.length === newKeys.length && !_different) {
      return oldValue;
    } else {
      return newObject;
    }
  } else if (customMutator !== undefined) {
    return customMutator(oldValue, newValue);
  } else {
    return newValue;
  }
}