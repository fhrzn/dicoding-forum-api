const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        expect(() => new DetailThread({ title: 'A Title', ownerName: 'user-1', body: 'Some body', created_at: '2023-01-01', comments: [] }))
            .toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        expect(() => new DetailThread({ id: 123, title: 'A Title', body: 'Some body', created_at: '2023-01-01', ownerName: 'user-1', comments: [] }))
            .toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create a DetailThread instance when payload is valid', () => {
        const payload = {
            id: 'thread-1',
            title: 'A Title',
            body: 'Some body',
            created_at: '2023-01-01',
            ownerName: 'user-1',
            comments: []
        };
        const detailThread = new DetailThread(payload);
        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.created_at);
        expect(detailThread.username).toEqual(payload.ownerName);
        expect(detailThread.comments).toEqual(payload.comments);
    });
    
})