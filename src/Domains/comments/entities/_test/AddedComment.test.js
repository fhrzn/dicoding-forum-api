const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        expect(() => new AddedComment({ content: 'This is a comment', owner: 'user-1' }))
            .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        expect(() => new AddedComment({ id: 'comment-1', content: 'This is a comment', owner: 123 }))
            .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create a AddedComment instance when payload is valid', () => {
        const payload = {
            id: 'comment-1',
            content: 'This is a comment',
            owner: 'user-1'
        };
        const addedComment = new AddedComment(payload);
        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);
    });
    
});