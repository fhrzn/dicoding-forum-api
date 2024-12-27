const CreateThread = require('../CreateThread');

describe('CreateThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        expect(() => new CreateThread({ title: 'A Thread'}))
            .toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it('should throw error when payload did not meet data type specification', () => {
        expect(() => new CreateThread({ title: 'A Thread', body: 123 }))
            .toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('should create CreateThread entity correctly when valid payload is provided', () => {
        const payload = {
            title: 'A Thread',
            body: 'this is a body'
        };
        const createThread = new CreateThread(payload);
        expect(createThread.title).toEqual(payload.title);
        expect(createThread.body).toEqual(payload.body);
    });
});
