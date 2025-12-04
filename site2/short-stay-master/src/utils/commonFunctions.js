import { entries, notEqual, values } from "./javascript";
import formValidation from "./validation";


const showFormErrors = (data, setData, ignore) => {
    let formErrors = {};
    entries(data).forEach(([key, value]) => {
        formErrors = {
            ...formErrors,
            ...formValidation(key, value, data, ignore),
        };
    });
    ignore?.forEach((name) => {
        if (formErrors[name]) {
            formErrors[name] = "";
        }
    });
    setData({ ...data, formErrors });
    return !values(formErrors).some((v) => notEqual(v, ""));
};
const checkFormErrors = (data, ignore) => {
    let formErrors = {};
    entries(data).forEach(([key, value]) => {
        formErrors = {
            ...formErrors,
            ...formValidation(key, value, data, ignore),
        };
    });
    ignore?.forEach((name) => {
        if (formErrors[name]) {
            formErrors[name] = "";
        }
    });
    return formErrors;
};


const capitalizeCamelCase = (str) => {
    let words = str.split(/(?=[A-Z])/);
    let capitalizedWords = words.map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    let capitalizedString = capitalizedWords.join(" ");
    return capitalizedString;
};

const spaceToDash = (inputString) => {
    return inputString.replace(/ /g, "-").toLowerCase();
};

const dashToSpace = (inputString) => {
    return inputString
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export {
    capitalizeCamelCase,
    showFormErrors,
    checkFormErrors,
    spaceToDash,
    dashToSpace,
};
