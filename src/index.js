export default function getWithMutations(oldValue, newValue, customMutator) {
  if (oldValue === null || oldValue === undefined || newValue === undefined || newValue === null || oldValue === newValue) {
    return newValue;
  }
  else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    const newLength = newValue.length;
    let newArray = [];
    let different = false;
    let result;
    for (let i = 0; i < newLength; i++) {
      result = getWithMutations(oldValue[i], newValue[i], customMutator);
      newArray.push(result);
      if (result !== oldValue[i]) {
        different = true;
      }
    }
    if (oldValue.length === newValue.length && !different) {
       return oldValue;
    }
    else {
      return newArray;
    }
  }
  else if (typeof oldValue === "object" && typeof newValue === "object") {
    let oldKeys = Object.keys(oldValue);
    let newKeys = Object.keys(newValue);
    const newKeyLength = newKeys.length;
    let oldKeyMap = oldKeys.reduce((map, key) => { map[key] = true; return map }, {});
    let newObject = {};
    let different = false;
    let newKey;
    let result;
    for (let i=0; i<newKeyLength; i++) {
      newKey = newKeys[i];
      if (oldKeyMap[newKey]) {
        result = getWithMutations(oldValue[newKey], newValue[newKey], customMutator);
        newObject[newKey] = result;
        if (result !== oldValue[newKey]) {
          different = true;
        }
      }
      else {
        different = true;
        newObject[newKey] = newValue[newKey];
      }
    }
    if (oldKeys.length === newKeys.length && !different) {
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