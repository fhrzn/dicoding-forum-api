const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    describe('when POST /comments', () => {
        it('should response 201 and create comment', async () => {
            const server = await createServer(container);

            const userPayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
            await server.inject({ 
                method: 'POST', 
                url: '/users', 
                payload: userPayload }
            );

            let authRes = await server.inject({ 
                method: 'POST', 
                url: '/authentications', 
                payload: {
                    username: userPayload.username,
                    password: userPayload.password
                },
            });
            authRes = JSON.parse(authRes.payload);
            const { accessToken: token } = authRes.data;

            let threadRes = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'A title',
                    body: 'a body'
                },
                headers: { authorization: `Bearer ${token}` },
            });
            threadRes = JSON.parse(threadRes.payload);
            const { id: threadId } = threadRes.data.addedThread;
            
            const commentPayload = { content: 'a content' };
            let commentRes = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
                headers: { authorization: `Bearer ${token}` },
            });
            
            expect(commentRes.statusCode).toEqual(201);
            commentRes = JSON.parse(commentRes.payload);
            expect(commentRes.status).toEqual('success');
            expect(commentRes.data.addedComment).toBeDefined();
        });
    });

    describe('when DELETE /comments', () => {
        it('should response 200 and delete comment',  async () => {
            const server = await createServer(container);

            const userPayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
            await server.inject({ 
                method: 'POST', 
                url: '/users', 
                payload: userPayload }
            );

            let authRes = await server.inject({ 
                method: 'POST', 
                url: '/authentications', 
                payload: {
                    username: userPayload.username,
                    password: userPayload.password
                },
            });
            authRes = JSON.parse(authRes.payload);
            const { accessToken: token } = authRes.data;

            let threadRes = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'A title',
                    body: 'a body'
                },
                headers: { authorization: `Bearer ${token}` },
            });
            threadRes = JSON.parse(threadRes.payload);
            const { id: threadId } = threadRes.data.addedThread;
            
            const commentPayload = { content: 'a content' };
            let commentRes = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
                headers: { authorization: `Bearer ${token}` },
            });
            commentRes = JSON.parse(commentRes.payload);
            const { id: commentId } = commentRes.data.addedComment;

            deleteRes = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: { Authorization: `Bearer ${token}` },
            });
            expect(deleteRes.statusCode).toEqual(200)
            deleteRes = JSON.parse(deleteRes.payload);
            expect(deleteRes.status).toEqual('success');
        });

        it('should throw 404 if thread is not found', async () => {
            const server = await createServer(container);
    
            const userPayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
            await server.inject({ method: 'POST', url: '/users', payload: userPayload });
    
            let authRes = await server.inject({ 
                method: 'POST', 
                url: '/authentications', 
                payload: {
                    username: userPayload.username,
                    password: userPayload.password
                },
            });
            authRes = JSON.parse(authRes.payload);
            const { accessToken: token } = authRes.data;
    
            const commentPayload = { content: 'a content' };
            let commentRes = await server.inject({
                method: 'POST',
                url: `/threads/123/comments`,
                payload: commentPayload,
                headers: { authorization: `Bearer ${token}` },
            });
    
            expect(commentRes.statusCode).toEqual(404);
            commentRes = JSON.parse(commentRes.payload);
            expect(commentRes.status).toEqual('fail');
        });
    
        it('should throw 404 if comment is not found', async () => {
            const server = await createServer(container);
    
            const userPayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
            await server.inject({ method: 'POST', url: '/users', payload: userPayload });
    
            let authRes = await server.inject({ 
                method: 'POST', 
                url: '/authentications', 
                payload: {
                    username: userPayload.username,
                    password: userPayload.password
                },
            });
            authRes = JSON.parse(authRes.payload);
            const { accessToken: token } = authRes.data;
    
            let threadRes = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'A title',
                    body: 'a body'
                },
                headers: { authorization: `Bearer ${token}` },
            });
            threadRes = JSON.parse(threadRes.payload);
            const { id: threadId } = threadRes.data.addedThread;
    
            deleteRes = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/999`,
                headers: { Authorization: `Bearer ${token}` },
            });
            expect(deleteRes.statusCode).toEqual(404);
            deleteRes = JSON.parse(deleteRes.payload);
            expect(deleteRes.status).toEqual('fail');
        });
        

        it('should throw 403 if user is not the comment author', async () => {
            const server = await createServer(container);

            const userPayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
            const user2Payload = { username: 'johndoe', password: 'secret', fullname: 'John Doe' };
            await server.inject({ method: 'POST', url: '/users',  payload: userPayload });
            await server.inject({ method: 'POST', url: '/users',  payload: user2Payload });

            let userAuthRes = await server.inject({ 
                method: 'POST', 
                url: '/authentications', 
                payload: {
                    username: userPayload.username,
                    password: userPayload.password
                },
            });
            userAuthRes = JSON.parse(userAuthRes.payload);
            const { accessToken: userToken } = userAuthRes.data;
            
            let userAuth2Res = await server.inject({ 
                method: 'POST', 
                url: '/authentications', 
                payload: {
                    username: user2Payload.username,
                    password: user2Payload.password
                },
            });
            userAuth2Res = JSON.parse(userAuth2Res.payload);
            const { accessToken: user2Token } = userAuth2Res.data;
            
            let threadRes = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'A title',
                    body: 'a body'
                },
                headers: { authorization: `Bearer ${userToken}` },
            });
            threadRes = JSON.parse(threadRes.payload);
            const { id: threadId } = threadRes.data.addedThread;
            
            const commentPayload = { content: 'a content' };
            let commentRes = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
                headers: { authorization: `Bearer ${userToken}` },
            });
            commentRes = JSON.parse(commentRes.payload);
            const { id: commentId } = commentRes.data.addedComment;

            deleteRes = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: { Authorization: `Bearer ${user2Token}` },
            });
            expect(deleteRes.statusCode).toEqual(403)
            deleteRes = JSON.parse(deleteRes.payload);
            expect(deleteRes.status).toEqual('fail');
        });
    });
});