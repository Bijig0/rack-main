import { specialCharacters } from "./regex";

export const equal = (obj1, obj2 = 0) => obj1 === obj2;

export const notEqual = (obj1, obj2) => !equal(obj1, obj2);

export const length = (obj) => obj?.length;

export const number = (obj) => Number(obj);

export const include = (arr, con) => arr && arr.includes(con);

export const spaceBetween = (text) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
export const fixValue = (val, toFix = 2) => val.toFixed(toFix);

export const createUrl = (val) => URL.createObjectURL(val);

export const values = (obj) => Object.values(obj);

export const keys = (obj) => Object.keys(obj);

export const entries = (obj) => Object.entries(obj);

export const ternary = (bool, truth, faulty) => (bool ? truth : faulty);

export const add = (v1) => (v2) =>
  ternary(equal(v2, 0), add(v1 + v2), ternary(v2, add(v1 + v2), v1));
export const subtract = (v1, v2) => v1 - v2;

export const multiply = (v1, v2) => v1 * v2;

export const divide = (v1, v2) => v1 / v2;

export const lessThan = (v1, v2) => v1 < v2;

export const split = (str, val) => str.split(val);

export const replace = (str, val, newVal) => str.replace(val, newVal);

export const greaterThan = (v1, v2) => v1 > v2;

export const greaterThanOrEqual = (v1, v2) => v1 >= v2;

export const lowerCase = (str) => str.toLowerCase();

export const some = (arr, str) => arr.some((d) => equal(d, str));

export const head = (obj) => obj[0];

export const reduce = (arr) => arr.reduce((obj1, obj2) => add(obj1)(obj2)(), 0);

export const customPasswordCheck = (value) => {
  const tempArr = [];
  const hasSpecialChar = specialCharacters(value);
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const checkLength = value.length >= 8;
  const hasNumber = /[0-9]/.test(value);

  if (
    !hasSpecialChar ||
    !hasUpperCase ||
    !hasLowerCase ||
    !hasNumber ||
    !checkLength
  ) {
    tempArr.push(
      "Password must has at least 8 characters that include at least 1 lowercase character , 1 uppercase characters , 1 number , and 1 special character in (!@#$%^&*)"
    );
  }

  return tempArr.join(", ");
};

export const stringToBoolean = (value) => ternary(value === "Yes", true, false);

export const booleanToString = (value) =>
  JSON.stringify(value) === "true"
    ? "Yes"
    : JSON.stringify(value) === "false"
    ? "No"
    : "";

export const FirstletterUpperCase = (value) =>
  spaceBetweenWords(value.charAt(0).toUpperCase() + value.slice(1));

export const spaceBetweenWords = (word) =>
  word.replace(/([a-z])([A-Z])/g, "$1 $2");

export const filterOneArrayFromAnother = (arr1, arr2) => {
  return arr1.filter((object1) => {
    return !arr2.find((object2) => {
      return JSON.stringify(object1) === JSON.stringify(object2);
    });
  });
};
