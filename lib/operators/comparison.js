'use strict';
const allNumbers = (list) => !list.some((i) => isNaN(Number(i)));

const withValidation =
  (validator) =>
  (fn) =>
  (...list) => {
    if (!validator(list)) {
      throw new Error('Sequence must contain only numbers');
    }
    return fn(...list);
  };

const withNumberValidation = withValidation(allNumbers);

const applyFnToEachPairInList =
  (fn) =>
  (...list) =>
    list.every((item, index, arr) => {
      if (index === arr.length - 1) return true;
      const nextItem = arr[index + 1];
      return fn(item, nextItem);
    });

const eq = (a, b) => a === b;
const gt = (a, b) => a > b;
const lt = (a, b) => a < b;
const gte = (a, b) => a >= b;
const lte = (a, b) => a <= b;

const allSame = applyFnToEachPairInList(eq);
const greaterThan = applyFnToEachPairInList(gt);
const lessThan = applyFnToEachPairInList(lt);
const greaterOrEqualThan = applyFnToEachPairInList(gte);
const lessOrEqualThan = applyFnToEachPairInList(lte);
const notEqual = (...list) => {
  const set = new Set(list);
  console.log(set);
  return set.size === list.length;
};

module.exports = {
  '=': withNumberValidation(allSame),
  '>': withNumberValidation(greaterThan),
  '<': withNumberValidation(lessThan),
  '>=': withNumberValidation(greaterOrEqualThan),
  '<=': withNumberValidation(lessOrEqualThan),
  '/=': withNumberValidation(notEqual),
};
