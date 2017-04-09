const expect = require('expect');
const {isRealString} = require("./validation.js");

describe('isRealString', () => {
   it('should reject non-string values', () => {
       expect(isRealString(12345)).toBe(false);
       expect(isRealString([1,2,3])).toBe(false);
   });

   it('should reject string with only spaces', () => {
       expect(isRealString('      ')).toBe(false);
   });

   it('should allow string with non-space characters', () => {
       expect(isRealString('Test')).toBe(true);
   });
});