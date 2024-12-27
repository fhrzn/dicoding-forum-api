const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    const userId = "user-123"
    const threadId = "thread-123"
    const fakeIdGenerator = () => '123';
    const createdAt = new Date();
    const createThreadPayload = new CreateThread({
        title: 'A title',
        body: 'this is thread body',
        createdAt: createdAt,
        owner: userId,
    });

    describe('createThread function', () => {
        it('should create a new thread', async () => {
            await UsersTableTestHelper.addUser({ id: userId });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await threadRepositoryPostgres.createThread(createThreadPayload, userId);

            // assert value in db
            const thread = await ThreadsTableTestHelper.getThreadId(threadId);
            
            expect(thread.id).toEqual(threadId);
            expect(thread.title).toEqual(createThreadPayload.title);
            expect(thread.body).toEqual(createThreadPayload.body);
            expect(thread.created_at.toString()).toEqual(createdAt.toString());
            expect(thread.owner).toEqual(userId);

        });

        it('should return created thread correctly', async () => {
            await UsersTableTestHelper.addUser({ id: userId });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedThread = await threadRepositoryPostgres.createThread(createThreadPayload, userId);
            
            expect(addedThread).toStrictEqual(new AddedThread({
                id: threadId,
                title: createThreadPayload.title,
                owner: userId,
            }));
        });
    });

    describe('getThreadById function', () => {
        it('should throw NotFoundError when thread is not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await expect(threadRepositoryPostgres.getThreadById('thread-231')).rejects.toThrowError(NotFoundError);
        });

        it('should return thread correctly', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread(createThreadPayload);
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // assert value via repository
            const thread = await threadRepositoryPostgres.getThreadById(threadId);
            
            expect(thread.id).toEqual(threadId);
            expect(thread.title).toEqual(createThreadPayload.title);
            expect(thread.body).toEqual(createThreadPayload.body);
            expect(thread.created_at.toString()).toEqual(createdAt.toString());
            expect(thread.owner).toEqual(userId);
        });
    });

    describe('verifyThreadExist', () => {
        it('should throw NotFoundError when thread is not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await expect(threadRepositoryPostgres.verifyThreadExist('thread-231')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when thread is found', async () => {
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.createThread(createThreadPayload);
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await expect(threadRepositoryPostgres.verifyThreadExist(threadId)).resolves.not.toThrowError(NotFoundError);
        });
    });
});