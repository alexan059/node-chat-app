const {expect} = require('chai');

const {prepString} = require('./string');

describe('utils/string', () => {
    describe('generateMessage', () => {
        it('should remove white spaces and transform to lower case', () => {
            let string = '   TestMessage   ';
            let result = 'testmessage';

            expect(prepString(string)).to.be.equal(result);
        });
    });
});