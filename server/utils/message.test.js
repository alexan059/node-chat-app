const {expect} = require('chai');

const {generateMessage, generateLocationMessage} = require('./message');

describe('utils/message', () => {
    describe('generateMessage', () => {
        it('should generate correct message object', () => {
            let from = 'Tester';
            let text = 'Test text from tester.';

            let message = generateMessage(from, text);

            expect(message.createdAt).to.be.a('number');
            expect(message).to.contain({from, text});
        });
    });

    describe('generateLocationMessage', () => {
        it('it should generate correct location object', () => {
            let from = 'Tester';
            let latitude = 15;
            let longitude = 27;
            let url = `https://www.google.com/maps?q=${latitude},${longitude}`;

            let message = generateLocationMessage(from, latitude, longitude);

            expect(message.createdAt).to.be.a('number');
            expect(message).to.contain({from, url});
        });
    });
});