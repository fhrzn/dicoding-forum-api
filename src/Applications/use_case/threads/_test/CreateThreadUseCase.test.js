const CreateThreadUseCase = require('../CreateThreadUseCase');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CreateThread = require('../../../../Domains/threads/entities/CreateThread');

describe('CreateThreadUseCase', () => {
    it('Should orchestrating the create thread action correctly', async () => {
        const payload = {
            title: 'A thread',
            body: 'this is a body',
        }

        const userId = 'user-123';

        const mockAddedThread = new AddedThread({ id: 'thread-123', title: payload.title, owner: userId });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.createThread = jest.fn(() => Promise.resolve(mockAddedThread));

        const createThreadUseCase = new CreateThreadUseCase({ threadRepository: mockThreadRepository });

        const addedThread = await createThreadUseCase.execute(payload, userId);

        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            title: payload.title,
            owner: userId
        }));

        expect(mockThreadRepository.createThread).toBeCalledWith(new CreateThread({
            title: payload.title,
            body: payload.body
        }), userId);
    })
})