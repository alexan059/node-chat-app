let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

let isValidCharacterSet = (str) => {
    return (str.match(/([0-9A-Za-z_-])+/) !== null);
};

let isValidString = (str) => {
    return (isRealString(str) && isValidCharacterSet(str));
};

let returnCaseInsensitive = (str) => {
    return str.trim().toLowerCase();
};

module.exports = {isRealString, isValidString, isValidCharacterSet, returnCaseInsensitive};