export default function getWithMutations(oldValue, newValue, customMutator) {
  if (oldValue === null || oldValue === undefined || newValue === undefined || newValue === null || oldValue === newValue) {
    return newValue;
  }
  else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length === newValue.length) {
      let newArray = oldValue.map((v, i) => getWithMutations(v, newValue[i], customMutator));
      if (oldValue.some((v, i) => v !== newArray[i])) {
        return newArray;
      }
      else {
        return oldValue;
      }
    }
    else {
      return newValue;
    }
  }
  else if (typeof oldValue === "object" && typeof newValue === "object") {
    let oldKeys = Object.keys(oldValue);
    let newKeys = Object.keys(newValue);
    let oldKeyMap = oldKeys.reduce((map, key) => { map[key] = true; return map }, {});
    let newObject = {};
    for (let newKey of newKeys) {
      if (oldKeyMap[newKey]) {
        newObject[newKey] = getWithMutations(oldValue[newKey], newValue[newKey], customMutator);
      }
      else {
        newObject[newKey] = newValue[newKey];
      }
    }
    if (oldKeys.length === newKeys.length && newKeys.every(newKey => oldKeyMap[newKey]) && oldKeys.every(oldKey => newObject[oldKey] === oldValue[oldKey])) {
      return oldValue;
    }
    else {
      return newObject;
    }
  }
  else if (customMutator !== undefined) {
    return customMutator(oldValue, newValue);
  }
  else {
    return newValue;
  }
}