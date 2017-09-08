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


React and shouldComponentUpdate
-----------

The motivation for this package was to provide the benefits of immutability when developing components with Facebook's [React package](https://github.com/facebook/react) without the overhead of a full immutable library such as Facebook's [Immutable package](https://github.com/facebook/immutable-js).

React provides a [PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) class that implements a Component that only updates a component when one of its props has changed based on a shallow equality check.

This means that the Component will re-render whenever any one of its props is no longer identical (`oldProp !== newProp`)

This package can help make this easier, as shown in the following example:

```javascript
import getWithMutations from 'with-mutations';
import React, { PureComponent, Component } from 'react';
import { render } from 'react-dom';

import PropTypes from 'prop-types';

class MyPureComponent extends PureComponent {
  static propTypes = {
    myProp: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    // rendering will only occur if myProp has changed (oldProps.myProp !== newProps.myProp)
    const { myProp } = this.props;

    return (
      <div>
        {myProp.map((anObject, i) => (
          <div key={i}>{anObject.value}</div>
        ))};
      </div>
    );
  }
}

class MyParentComponent extends Component {
  constructor(props) {
    super(props);
    this.intervalId = null;
    this.state = { data: generateData() };
  }

  componentDidMount() {
    // start a timer to change the data every 5 seconds
    this.intervalId = setInterval(() => {
      const oldData = this.state.data; // get the old data
      const newData = generateData(); // create new data
      
      // same object reference will be returned if old data is functionally equal to the new data
      const data = getWithMutations(oldData, newData);

      this.setState({ data });
    }, 5000);
  }

  componentWillUnmount() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  render() {
    const { data } = this.state;
    return (
      <MyPureComponent myProp={data}/>
    )
  }
}

function generateData() {
  // generate an array containing 10 objects...
  const data = [];
  for (let i=0; i<10; i++) {
    data.push({ value: i });
  }
  return data;
}

render(<MyParentComponent/>, document.getElementById('root'));

```