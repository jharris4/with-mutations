import getWithMutations from '../src';

describe('undefined or null or identical reference values', () => {
  test('returns the new value if the old value is null', () => {
    expect(getWithMutations(null, "anything")).toBe("anything");
  });

  test('returns the new value if the old value is undefined', () => {
    expect(getWithMutations(undefined, "anything")).toBe("anything");
  });

  test('returns the new value if the new value is null', () => {
    expect(getWithMutations("anything", null)).toBe(null);
  });

  test('returns the new value if the new value is undefined', () => {
    expect(getWithMutations("anything", undefined)).toBe(undefined);
  });

  test('returns the new value if the new value is the same object as the old value', () => {
    const value = {};
    expect(getWithMutations(value, value)).toBe(value);
  });

  test('returns the new value if the new value is the same array as the old value', () => {
    const value = [];
    expect(getWithMutations(value, value)).toBe(value);
  });
});

describe('different values', () => {
  test('uses the new value for numbers', () => {
    expect(getWithMutations(1, 2)).toBe(2);
  });

  test('uses the new value for strings', () => {
    expect(getWithMutations("a", "b")).toBe("b");
  });

  test('uses the new value for booleans', () => {
    expect(getWithMutations(true, false)).toBe(false);
  });

  test('uses the new value for objects', () => {
    const newValue = { a: 2, b: 1 };
    expect(getWithMutations({ a: 1, b: 1 }, newValue)).toEqual(newValue);
  });

  test('uses the new value for arrays', () => {
    const newValue = [1, 2, 3];
    expect(getWithMutations([1, 2, 2], newValue)).toEqual(newValue);
  });
});

describe('same values', () => {
  test('uses the old value for numbers', () => {
    expect(getWithMutations(1, 1)).toBe(1);
  });

  test('uses the old value for strings', () => {
    expect(getWithMutations("a", "a")).toBe("a");
  });

  test('uses the old value for booleans', () => {
    expect(getWithMutations(true, true)).toBe(true);
  });

  test('uses the old value for objects', () => {
    const oldValue = { a: 1, b: 1 };
    expect(getWithMutations(oldValue, { a: 1, b: 1 })).toEqual(oldValue);
  });

  test('uses the old value for arrays', () => {
    const oldValue = [1, 2, 3];
    expect(getWithMutations(oldValue, [1, 2, 3])).toEqual(oldValue);
  });
});

describe('nested values', () => {
  test('uses old object property values when they are the same, or new object property values when they are different', () => {
    const newNestedA = { a: 1 };
    const oldNestedA = { a: 1 };
    const newNestedB = "abc";
    const oldNestedB = "xyz";
    const oldValue = { nestedA: oldNestedA, nestedB: oldNestedB };
    const newValue = { nestedA: newNestedA, nestedB: newNestedB };

    const withMutations = getWithMutations(oldValue, newValue);

    expect(withMutations).not.toBe(newValue);
    expect(withMutations.nestedA).toBe(oldNestedA);
    expect(withMutations.nestedB).toBe(newNestedB);
  });

  test('uses old array values when they are the same, or new arra values when they are different', () => {
    const newNestedA = { a: 1 };
    const oldNestedA = { a: 1 };
    const newNestedB = "abc";
    const oldNestedB = "xyz";
    const oldValue = [ oldNestedA, oldNestedB ];
    const newValue = [ newNestedA, newNestedB ];

    const withMutations = getWithMutations(oldValue, newValue);

    expect(withMutations).not.toBe(newValue);
    expect(withMutations[0]).toBe(oldNestedA);
    expect(withMutations[1]).toBe(newNestedB);
  });

  test('uses old object property values when they are the same, or new object property values when they are added', () => {
    const newNestedA = { a: 1 };
    const oldNestedA = { a: 1 };
    const newNestedB = "abc";
    const oldNestedB = "xyz";
    const newNestedC = { b: 2 };
    const oldValue = { nestedA: oldNestedA, nestedB: oldNestedB };
    const newValue = { nestedA: newNestedA, nestedB: newNestedB, nestedC: newNestedC };

    const withMutations = getWithMutations(oldValue, newValue);

    expect(withMutations).not.toBe(newValue);
    expect(withMutations.nestedA).toBe(oldNestedA);
    expect(withMutations.nestedB).toBe(newNestedB);
    expect(withMutations.nestedC).toBe(newNestedC);
  });

  test('uses old array values when they are the same, or new arra values when they are added', () => {
    const newNestedA = { a: 1 };
    const oldNestedA = { a: 1 };
    const newNestedB = "abc";
    const oldNestedB = "xyz";
    const newNestedC = { b: 2 };
    const oldValue = [oldNestedA, oldNestedB];
    const newValue = [newNestedA, newNestedB, newNestedC];

    const withMutations = getWithMutations(oldValue, newValue);

    expect(withMutations).not.toBe(newValue);
    expect(withMutations[0]).toBe(oldNestedA);
    expect(withMutations[1]).toBe(newNestedB);
    expect(withMutations[2]).toBe(newNestedC);
  });
});

describe('function values', () => {
  test('uses the new value for an identical function reference', () => {
    const value = () => {};
    expect(getWithMutations(value, value)).toBe(value);
  });

  test('uses the new value for an different function reference', () => {
    const oldValue = () => { };
    const newValue = () => { };
    expect(getWithMutations(oldValue, newValue)).toBe(newValue);
  });
});

describe('custom mutator', () => {
  test('it allows the custom mutator to override the default logic', () => {
    const oldValue = () => { };
    const newValue = () => { };
    oldValue.prop = 'a';
    newValue.prop = 'a';

    const customMutator = (oldValue, newValue) => oldValue.prop === newValue.prop ? oldValue : newValue;

    expect(getWithMutations(oldValue, newValue, customMutator)).toBe(oldValue);
  });
});
