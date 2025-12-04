import { capitalizeCamelCase } from "./commonFunctions";
import { equal, length } from "./javascript";
import {
  emailValidation,
  whiteSpaceCheck,
  passwordValidation,
  snakeToTitleCase,
} from "./regex";

const formValidation = (name, value, state, ignore = []) => {

  let formErrors = { ...state.formErrors };

  if (ignore.includes(name)) {
    if (formErrors[name]) {
      formErrors[name] = "";
    }
    return formErrors;
  }

  switch (name) {
    case "email":
      if (equal(length(value))) {
        formErrors[name] = `${capitalizeCamelCase(name)} is required!`;
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = `Unnecessary space in word!`;
      } else if (!emailValidation(value)) {
        formErrors[name] = `Please enter valid email!`;
      } else {
        formErrors[name] = "";
      }
      break;
    case "password":
    case "newPassword":
      if (equal(length(value))) {
        formErrors[name] = `${snakeToTitleCase(name)} is required!`;
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = `Unnecessary space in word!`;
      } else if (!passwordValidation(value)) {
        formErrors[
          name
        ] = `Please enter a password with 8-16 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`;
      } else {
        formErrors[name] = "";
      }

      break;
    case "confirmPassword":
      if (equal(length(value))) {
        formErrors[name] = `${snakeToTitleCase(name)} is required!`;
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = `Unnecessary space in word!`;
      } else if (value !== state["password"] && value !== state["newPassword"]) {
        formErrors[name] = "Password does not match";
      } else {
        formErrors[name] = "";
      }
      break;

    case "category":
    case "selectedCategory":
      if (!value) {
        formErrors[name] = `Category is required!`;
      } else {
        formErrors[name] = "";
      }
      break;
    case "name":
    case "fullName":
    case "title":
    case "tagLine":
    case "location":
    case "meetupLead":
    case "type":
    case "folder":
    case "description":
    case "oldPassword":
      if (equal(length(value))) {

        formErrors[name] = `${capitalizeCamelCase(name)} is required!`;
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = `Unnecessary space in word!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "leaders":
      if (!value.length) {
        formErrors[name] = `${capitalizeCamelCase(name)} are required!`;
      } else {
        formErrors[name] = "";
      }
      break;
    case "endDate":
      if (equal(length(value))) {
        formErrors[name] = `${capitalizeCamelCase(name)} is required!`;
      } else if (value < state?.startDate) {
        formErrors[name] = `End date should not be less than start date`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "otpCode":
      if (!value) {
        formErrors[name] = `${capitalizeCamelCase(name)} is required!`;
      } else if (value?.toString()?.length !== 6) {
        formErrors[name] = "Enter a valid OTP";
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = "Unnecessary space in OTP!";
      } else {
        formErrors[name] = "";
      }
      break;

    default:
      break;
  }
  return formErrors;
};

export default formValidation;
