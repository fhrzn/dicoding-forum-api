const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
    it('should throw error when invoke abstract behaviors', async () => {
        const commentRepository = new CommentRepository();

        await expect(commentRepository.createComment({}, '', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.getCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.verifyCommentExist('', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.verifyCommentOwner('', '', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.deleteComment('', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

})