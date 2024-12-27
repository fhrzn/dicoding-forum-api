const CreateCommentUseCase = require('../CreateCommentUseCase');
const CreateComment = require('../../../../Domains/comments/entities/CreateComment');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('CreateCommentUseCase', () => {
    it('should orchestrate the comment creation action correctly', async() => {
        const commentPayload = { content: 'A comment' };
        const userId = 'user-123';
        
        const mockAddedComment = new AddedComment({ id: 'comment-123', content: commentPayload.content, owner: userId });
        const mockAddedThread = new AddedThread({ id: 'thread-123', title: 'A thread', owner: userId });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.createComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment));

        const createCommentUseCase = new CreateCommentUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository });

        const addedComment = await createCommentUseCase.execute(commentPayload, mockAddedThread.id, userId);

        expect(addedComment).toStrictEqual(new AddedComment({
            id: mockAddedComment.id,
            content: commentPayload.content,
            owner: userId
        }));

        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(mockAddedThread.id)
        expect(mockCommentRepository.createComment).toBeCalledWith(new CreateComment({
            content: commentPayload.content
        }), mockAddedThread.id, userId);
    });
});
