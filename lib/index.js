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
    if (oldValue.length === newValue.length) {
      var newArray = oldValue.map(function (v, i) {
        return getWithMutations(v, newValue[i], customMutator);
      });
      if (oldValue.some(function (v, i) {
        return v !== newArray[i];
      })) {
        return newArray;
      } else {
        return oldValue;
      }
    } else {
      return newValue;
    }
  } else if ((typeof oldValue === "undefined" ? "undefined" : _typeof(oldValue)) === "object" && (typeof newValue === "undefined" ? "undefined" : _typeof(newValue)) === "object") {
    var oldKeys = Object.keys(oldValue);
    var newKeys = Object.keys(newValue);
    var oldKeyMap = oldKeys.reduce(function (map, key) {
      map[key] = true;return map;
    }, {});
    var newObject = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = newKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var newKey = _step.value;

        if (oldKeyMap[newKey]) {
          newObject[newKey] = getWithMutations(oldValue[newKey], newValue[newKey], customMutator);
        } else {
          newObject[newKey] = newValue[newKey];
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (oldKeys.length === newKeys.length && newKeys.every(function (newKey) {
      return oldKeyMap[newKey];
    }) && oldKeys.every(function (oldKey) {
      return newObject[oldKey] === oldValue[oldKey];
    })) {
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