const expect = require('expect');

const {makeCaseInsensitive} = require('./string');

describe('makeCaseInsensitive', () => {
    it('should transform all characters of a string to lower case', () => {
        expect(makeCaseInsensitive('This Is A Test')).toBe('this is a test');
    });
});