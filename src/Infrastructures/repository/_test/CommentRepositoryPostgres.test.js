const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const fakeIdGenerator = () => '123';

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('createComment function', () => {
        it('should create a new comment', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread({ id: threadId, owner: userId });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const commentPayload = new CreateComment({ content: 'a content' });
            const res = await commentRepositoryPostgres.createComment(commentPayload, threadId, userId);
            

            const comment = await CommentsTableTestHelper.getCommentById('comment-123');
            
            expect(comment).toHaveLength(1);
        });

        it('should return created comment correctly', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread({ id: threadId, owner: userId });

            const commentPayload = new CreateComment({
                content: 'A content',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const addedComment = await commentRepositoryPostgres.createComment(commentPayload, threadId, userId);

            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: commentPayload.content,
                owner: userId,
            }));
        });
    });

    describe('getCommentsByThreadId function', () => {
        it('should return comments correctly excluding soft deleted comments', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread({ id: threadId, owner: userId });
            await CommentsTableTestHelper.createComment({ id: 'comment-123', owner: userId, thread_id: threadId });
            await CommentsTableTestHelper.createComment({ id: 'comment-234', owner: userId, thread_id: threadId });
            await CommentsTableTestHelper.createComment({ id: 'comment-345', owner: userId, thread_id: threadId, soft_delete: true });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId); 

            expect(comments).toHaveLength(3);
            comments.forEach((comment, index) => {
                switch (index) {
                    case 0:
                        expect(comment.id).toEqual('comment-123');
                        expect(comment.soft_delete).toBe(false);
                        break;
                    case 1:
                        expect(comment.id).toEqual('comment-234');
                        expect(comment.soft_delete).toBe(false);
                        break;
                    case 2:
                        expect(comment.id).toEqual('comment-345');
                        expect(comment.soft_delete).toBe(true);
                        break;
                    default:
                        break;
                }
                expect(comment.content).toEqual('A comment');
                expect(comment.owner).toEqual(userId);
                expect(comment.thread_id).toEqual(threadId);
            });

        });

        it('should return empty array if there is no comment yet', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

            expect(Array.isArray(comments)).toBeTruthy;
            expect(comments).toHaveLength(0);
        });
    });

    describe('getCommentById function', () => {
        it('should return the correct comment when it exists', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread({ id: threadId, owner: userId });
            await CommentsTableTestHelper.createComment({ id: 'comment-123', owner: userId, thread_id: threadId });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            const comment = await commentRepositoryPostgres.getCommentById('comment-123');

            expect(comment).toEqual(new AddedComment({
                id: 'comment-123',
                content: 'A comment',
                owner: userId,
            }));
        });

        it('should return null if the comment does not exist', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            const comment = await commentRepositoryPostgres.getCommentById('non-existent-comment-id');

            expect(comment).toBeNull();
        });
    });

    describe('deleteComent function', () => {
        it('should throw NotFoundError when comment is not found', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await expect(commentRepositoryPostgres.verifyCommentExist('comment-123')).rejects.toThrowError(NotFoundError);
        });

        it('should throw AuthorizationError when user is not comment owner', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread({ id: threadId, owner: userId });
            await CommentsTableTestHelper.createComment({ id: 'comment-123', owner: userId, thread_id: threadId });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-789')).rejects.toThrowError(AuthorizationError);
        });

        it('should delete the comment correctly', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread({ id: threadId, owner: userId });
            await CommentsTableTestHelper.createComment({ id: 'comment-123', owner: userId, thread_id: threadId });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await commentRepositoryPostgres.verifyCommentExist('comment-123');
            await commentRepositoryPostgres.verifyCommentOwner('comment-123', userId);
            await commentRepositoryPostgres.deleteComment(threadId, 'comment-123');

            const deletedComment = await CommentsTableTestHelper.getCommentById('comment-123');
            expect(deletedComment[0].soft_delete).toBe(true);
        });
    });
})