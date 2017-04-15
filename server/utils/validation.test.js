const {expect} = require('chai');
const {isRealString, isValidString, isValidCharacterSet, returnCaseInsensitive} = require("./validation.js");

let testString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

describe('utils/validation', () => {
    describe('isRealString', () => {
        it('should reject non-string values', () => {
            expect(isRealString(123)).to.be.false;
            expect(isRealString([1,2,3])).to.be.false;
            expect(isRealString({1:1,2:2,3:3})).to.be.false;
        });

        it('should reject a string with only spaces', () => {
            expect(isRealString('     ')).to.be.false;
        });

        it('should allow string with non-space characters', () => {
            expect(isRealString(testString)).to.be.true;
        });
    });

    describe('isValidCharacterSet', () => {
        it('should reject string without allowed characters', () => {
            expect(isValidCharacterSet('.,*#/\\ ')).to.be.false;
        });

        it('should allow string with lower/uppercase letters, numbers, hyphen and underscore', () => {
            expect(isValidCharacterSet(testString)).to.be.true;
        });
    });

    describe('isValidString', () => {
        it('should reject string within the requirements of isRealString and isValidCharacterSet', () => {
            expect(isValidString(123)).to.be.false;
            expect(isValidString([1,2,3])).to.be.false;
            expect(isValidString({1:1,2:2,3:3})).to.be.false;
            expect(isValidString('     ')).to.be.false;
            expect(isValidString('.,*#/\\ ')).to.be.false;
            expect(isValidString(undefined)).to.be.false;
        });

        it('should allow string within the requirement of isRealString and isValidCharacterSet', () => {
            expect(isValidString(testString)).to.be.true;
        });
    });
});