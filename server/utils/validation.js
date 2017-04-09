let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

let isValidString = (str) => {
    if (str.match(/([0-9A-Za-z_-])+/) === null) {
        return false;
    }

    return isRealString(str);
};

module.exports = {isRealString, isValidString};