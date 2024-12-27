const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should orchestrate the comment deletion action correctly', async () => {
        const userId = 'user-123';
        const threadId = 'thread-123';
        const commentId = 'comment-123';

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        await deleteCommentUseCase.execute(userId, threadId, commentId);

        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(commentId);
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, userId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(threadId, commentId);
    });
});
