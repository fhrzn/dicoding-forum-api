const UserRepository = require('../../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

const GetThreadUseCase = require('../GetThreadUseCase');
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser');

describe('GetThreadUseCase', () => {
    it('Should orchestrating get thread details', async () => {
        const threadId = 'thread-123';
        const userId = 'user-123';

        const mockUser = new RegisteredUser({
            id: userId,
            username: 'dicoding',
            fullname: 'Dicoding Indonesia'
        });

        const mockThread = {
            id: threadId,
            title: 'A title',
            body: 'A body',
            created_at: new Date(),
            owner: userId,
        };

        // const mockThread = new 

        const mockComments = [
            {
                id: 'comment-123',
                content: 'amended comment',
                owner: userId,
                created_at: '2024-12-08 00:00:00',
                thread_id: threadId,
                soft_delete: false
            },
            {
                id: 'comment-234',
                content: 'comment',
                owner: userId,
                created_at: '2024-12-08 00:00:00',
                thread_id: threadId,
                soft_delete: false
            },
            {
                id: 'comment-456',
                content: 'just another comment',
                owner: userId,
                created_at: '2024-12-08 00:00:00',
                thread_id: threadId,
                soft_delete: true
            }
        ];

        const mockUserRepository = new UserRepository()
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
        mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComments));
        mockUserRepository.getUserById = jest.fn().mockImplementation(() => Promise.resolve(mockUser));

        const getThreadUseCase = new GetThreadUseCase({
            userRepository: mockUserRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        });

        const thread = await getThreadUseCase.execute(threadId);
        expect(thread.comments).toHaveLength(3);
        expect(thread.id).toBe(mockThread.id);
        expect(thread.title).toBe(mockThread.title);
        expect(thread.body).toBe(mockThread.body);
        expect(thread.date).toBe(mockThread.created_at.toString());
        expect(thread.username).toBe(mockUser.username);

        thread.comments.forEach((comment, index) => {
            const mockComment = mockComments[index];
            expect(comment.id).toBe(mockComment.id);
            expect(comment.username).toBe(mockUser.username);
            expect(comment.date).toBe(mockComment.created_at);
            if (mockComment.soft_delete) {
                expect(comment.content).toBe('**komentar telah dihapus**');
            } else {
                expect(comment.content).toBe(mockComment.content);
            }
        });
    })
})