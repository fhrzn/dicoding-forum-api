const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTabletestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTabletestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and created threads', async () => {
            const threadPayload = {
                title: 'A title',
                body: 'a body',
            };

            const server = await createServer(container);

            const userObj = {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            }
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: userObj,
            });

            let res = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: { username: userObj.username, password: userObj.password },
            });

            res = JSON.parse(res.payload);
            const { accessToken: token } = res.data;

            let threadRes = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            

            expect(threadRes.statusCode).toEqual(201);
            
            threadRes = JSON.parse(threadRes.payload);
            expect(threadRes.status).toEqual('success');
            expect(threadRes.data.addedThread).toBeDefined();
        });
    });

    describe('when GET/threads/{threadId}', () => {
        it('should return thread details', async () => {
            const server = await createServer(container);
            
            const threadPayload = { title: 'A title', body: 'a body' };
            const userPayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
            const commentPayload = { content: 'a comment' };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: userPayload,
            });
            
            let authRes = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: { username: userPayload.username, password: userPayload.password },
            });
            authRes = JSON.parse(authRes.payload);
            const { accessToken: token } = authRes.data;

            let threadRes = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: { Authorization: `Bearer ${token}` }
            });
            threadRes = JSON.parse(threadRes.payload);
            const threadId = threadRes.data.addedThread.id;

            await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
                headers: { Authorization: `Bearer ${token}` },
            });

            let getRes = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });
            
            expect(getRes.statusCode).toEqual(200);
            getRes = JSON.parse(getRes.payload);
            expect(getRes.status).toEqual('success');
            expect(getRes.data.thread).toBeDefined();
        });
    })
})