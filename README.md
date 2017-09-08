A simple function to mutate basic JavaScript variables in an immutable fashion
========================================
[![npm version](https://badge.fury.io/js/with-mutations.svg)](https://badge.fury.io/js/with-mutations) [![Build Status](https://travis-ci.org/jharris4/with-mutations.svg?branch=master)](https://travis-ci.org/jharris4/with-mutations)

This package provides a `getWithMutations(oldValue, newValue)` function that returns the `oldValue` when the values are equal, or returns the `newValue` when the values are different.

It operates recursively on objects or arrays, preserving nested value equality whenever possible.

Installation
------------
Install the plugin with npm:
```shell
$ npm install --save with-mutations
```


Basic Usage
-----------
Mutating two equal values:

```javascript
import getWithMutations from 'with-mutations';

const oldValue = { a: 1 };
const newValue = { a: 1 };
const result = getWithMutations(oldValue, newValue);

console.log(result === oldValue); // true
console.log(result === newValue); // false
```

Mutating two different values with some overlap:

```javascript
import getWithMutations from 'with-mutations';

const oldValue = [ { a: 1 }, { b: 1 } ];
const newValue = [ { a: 1 }, { b: 2 } ];
const result = getWithMutations(oldValue, newValue);

console.log(result === oldValue); // false
console.log(result === newValue); // false

console.log(result[0] === oldValue[0]); // true
console.log(result[1] === oldValue[1]); // false

console.log(result[0] === newValue[0]); // false
console.log(result[1] === newValue[1]); // true
```

Custom mutatators
-----------

The `getWithMutations` function takes an optional third argument which is the custom mutator.

The `customMutator` should be a function which takes the oldValue and newValue as arguments and returns the result.

Note that the custom mutator is only executed if all of the following are true:
- Neither of the values are null or undefined
- The values are not identical references or primitive values
- The values are not both arrays or objects

```javascript
import getWithMutations from 'with-mutations';

const oldValue = () => { };
const newValue = () => { };
oldValue.prop = 'a';
newValue.prop = 'a';

const customMutator = (oldValue, newValue) => oldValue.prop === newValue.prop ? oldValue : newValue;

const result = getWithMutations(oldValue, newValue, customMutator)

console.log(result === oldValue); // true
console.log(result === newValue); // false
```