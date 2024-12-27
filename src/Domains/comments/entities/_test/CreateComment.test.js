const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        expect(() => new CreateComment({}))
            .toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        expect(() => new CreateComment({ content: 123 }))
            .toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create CreateComment entity correctly when valid payload is provided', () => {
        const payload = {
            content: 'This is a comment'
        };
        const createComment = new CreateComment(payload);
        expect(createComment.content).toEqual(payload.content);
    });
    
})