const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        expect(() => new AddedThread({ title: 'A Thread', owner: 'user-1' }))
            .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        expect(() => new AddedThread({ id: 'thread-1', title: 'A Thread', owner: 123 }))
            .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create a AddedThread instance when payload is valid', () => {
        const payload = {
            id: 'thread-1',
            title: 'A Thread',
            owner: 'user-1'
        };
        const addedThread = new AddedThread(payload);
        expect(addedThread.id).toEqual(payload.id);
        expect(addedThread.title).toEqual(payload.title);
        expect(addedThread.owner).toEqual(payload.owner);
    });
});
