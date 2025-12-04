export const alphabeticStringValidation = (val) => {
  const regex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
  return regex.test(val);
};

export const regularString = (val) => {
  const regex =
    /^[\w!@#$%^&*()\-=_+{}[\]|;:'",.<>/?]+(?: [\w!@#$%^&*()\-=_+{}[\]|;:'",.<>/?]+)*$/;
  return regex.test(val);
};

export const stringValidation = (val) => {
  const regex = /^[a-zA-Z0-9_.-]*$/;
  return regex.test(val);
};

export const onlyAlphabeticStringValidation = (val) => {
  const regex = /^[A-Za-z]+$/;
  return regex.test(val);
};

export const emailValidation = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
};

export const phoneValidation = (phone) => {
  const regex =
    /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;
  return regex.test(phone.toLowerCase());
};

export const passwordValidation = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
  return regex.test(password);
};

export const spaceBetweenWords = (word) =>
  word.replace(/([a-z])([A-Z])/g, "$1 $2");

export const number = (value) => {
  const regex = /^[0-9]+$|^$/;
  return regex.test(value);
};
export const isNumberOrDecimal = (value) => {
  const regex = /^-?\d+(\.\d+)?$/;
  return regex.test(value);
};

export const floatFromString = (value) => {
  const regex = /[+-]?\d+(\.\d+)?/g;
  return value.match(regex).map(function f(v) {
    return parseFloat(v);
  });
};

export const whiteSpaceCheck = (value) => {
  const regex = /^\s/;
  return regex.test(value);
};

export const firstLetterToUppercase = (value) =>
  spaceBetweenWords(value.replace(/\b\w/g, (c) => c.toUpperCase()));

export const specialCharacters = (value) =>
  /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/.test(value);

export const snakeToTitleCase = (str) => {
  return str
    .split("_") // Split at underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join words with space
};
