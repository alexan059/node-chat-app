let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

let isValidCharacterSet = (str) => {
    return /^([0-9A-Za-z])+$/.test(str.trim());
};

let isValidString = (str) => {
    return isRealString(str) && isValidCharacterSet(str);
};

module.exports = {isRealString, isValidString, isValidCharacterSet};