let expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'Tester';
        let text = 'Test text from tester.'

        let message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        });
    });
});

describe('generateLocationMessage', () => {
    it('it should generate correct location object', () => {
        it('should generate correct message object', () => {
            let from = 'Tester';
            let latitude = 15;
            let longitude = 27;
            let url = `https://www.google.com/maps?q=${latitude},${longitude}`;

            let message = generateLocationMessage(from, 1, 1);

            expect(message.createdAt).toBeA('number');
            expect(message).toInclude({
                from,
                url
            });
        });
    })
});